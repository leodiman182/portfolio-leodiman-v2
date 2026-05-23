"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CampfireScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── STARS ────────────────────────────────────────────────────────────────
    // Camera FOV 60° at z=6 → visible y: -3.46 to +3.46
    // Stars start at y=1.2 so they only appear in the upper ~30% of screen,
    // keeping the text area clear.
    const STAR_COUNT = 420;
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starPhase = new Float32Array(STAR_COUNT);
    const starSize = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 22;
      starPos[i * 3 + 1] = Math.random() * 8 + 1.2;  // y: 1.2 → 9.2, above text
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      starPhase[i]       = Math.random() * Math.PI * 2;
      starSize[i]        = Math.random() * 0.55 + 0.15; // smaller points
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("aPhase",   new THREE.BufferAttribute(starPhase, 1));
    starGeo.setAttribute("aSize",    new THREE.BufferAttribute(starSize, 1));

    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aPhase;
        attribute float aSize;
        uniform float uTime;
        varying float vOpacity;
        void main() {
          vOpacity = 0.35 + 0.65 * abs(sin(uTime * 0.6 + aPhase));
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (130.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = (1.0 - d * 2.0) * vOpacity;
          gl_FragColor = vec4(0.94, 0.90, 0.83, alpha);
        }
      `,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── MILKY WAY BAND ───────────────────────────────────────────────────────
    const MW_COUNT = 200;
    const mwPos = new Float32Array(MW_COUNT * 3);
    for (let i = 0; i < MW_COUNT; i++) {
      const t = (i / MW_COUNT) * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 1.4;
      mwPos[i * 3]     = Math.cos(t * 0.3) * 8 + spread * 2;
      mwPos[i * 3 + 1] = Math.sin(t * 0.15) * 2 + spread + 3.5; // pushed higher
      mwPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    const mwGeo = new THREE.BufferGeometry();
    mwGeo.setAttribute("position", new THREE.BufferAttribute(mwPos, 3));
    const mwMat = new THREE.PointsMaterial({
      color: 0xc9a97a,
      size: 0.025,
      transparent: true,
      opacity: 0.10,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(mwGeo, mwMat));

    // ── TREE SILHOUETTE (clareira central para o fogo) ───────────────────────
    // Camera FOV 60° at z=6 → screen bottom ≈ y=-3.46
    // Clearing floor at y=-3.1 so the campfire area is fully visible
    const shape = new THREE.Shape();
    shape.moveTo(-12, -5);
    shape.lineTo(-9,  -1.0);   // tall left mountain
    shape.lineTo(-7.5,-2.2);   // valley
    shape.lineTo(-5.5,-0.5);   // tall left tree
    shape.lineTo(-4.5,-1.8);   // slope down
    shape.lineTo(-3.0,-1.2);   // small bush
    shape.lineTo(-2.5,-3.1);   // descend into clearing
    // flat campfire clearing floor
    shape.lineTo( 2.5,-3.1);
    shape.lineTo( 3.0,-1.2);   // small bush (right)
    shape.lineTo( 4.5,-1.8);   // slope up
    shape.lineTo( 5.5,-0.5);   // tall right tree
    shape.lineTo( 7.5,-2.2);   // valley
    shape.lineTo( 9,  -1.0);   // tall right mountain
    shape.lineTo( 12, -5);
    shape.closePath();

    const silhouetteGeo = new THREE.ShapeGeometry(shape);
    const silhouetteMat = new THREE.MeshBasicMaterial({ color: 0x0a0806 });
    const silhouette = new THREE.Mesh(silhouetteGeo, silhouetteMat);
    silhouette.position.z = 0.5;
    scene.add(silhouette);

    // ── FIRE PARTICLES ────────────────────────────────────────────────────────
    const FIRE_COUNT = 65;
    const firePos   = new Float32Array(FIRE_COUNT * 3);
    const fireVel   = new Float32Array(FIRE_COUNT * 3);
    const fireLife  = new Float32Array(FIRE_COUNT);
    const fireCol   = new Float32Array(FIRE_COUNT * 3);

    const resetFire = (i: number, randomY = false) => {
      firePos[i * 3]     = (Math.random() - 0.5) * 0.22;   // narrow horizontal spread
      firePos[i * 3 + 1] = -3.1 + (randomY ? Math.random() * 1.2 : 0);
      firePos[i * 3 + 2] = 1;
      fireVel[i * 3]     = (Math.random() - 0.5) * 0.005;  // minimal sideways drift
      fireVel[i * 3 + 1] = 0.005 + Math.random() * 0.007;  // very slow rise
      fireVel[i * 3 + 2] = 0;
      fireLife[i] = 0.7 + Math.random() * 0.3;
      const heat = Math.random();
      fireCol[i * 3]     = 1.0;
      fireCol[i * 3 + 1] = 0.2 + heat * 0.55;
      fireCol[i * 3 + 2] = heat * 0.06;
    };

    for (let i = 0; i < FIRE_COUNT; i++) resetFire(i, true);

    const fireGeo = new THREE.BufferGeometry();
    fireGeo.setAttribute("position", new THREE.BufferAttribute(firePos, 3));
    fireGeo.setAttribute("color",    new THREE.BufferAttribute(fireCol, 3));

    const fireMat = new THREE.PointsMaterial({
      size: 0.07,
      transparent: true,
      opacity: 0.50,
      vertexColors: true,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const fireMesh = new THREE.Points(fireGeo, fireMat);
    scene.add(fireMesh);

    // ── EMBER PARTICLES ───────────────────────────────────────────────────────
    const EMBER_COUNT = 14;
    const emberPos  = new Float32Array(EMBER_COUNT * 3);
    const emberVel  = new Float32Array(EMBER_COUNT * 3);
    const emberLife = new Float32Array(EMBER_COUNT);

    const resetEmber = (i: number, randomY = false) => {
      emberPos[i * 3]     = (Math.random() - 0.5) * 0.18;
      emberPos[i * 3 + 1] = -3.1 + (randomY ? Math.random() * 1.4 : 0);
      emberPos[i * 3 + 2] = 1.1;
      emberVel[i * 3]     = (Math.random() - 0.5) * 0.010;
      emberVel[i * 3 + 1] = 0.010 + Math.random() * 0.012;
      emberVel[i * 3 + 2] = 0;
      emberLife[i] = 0.8 + Math.random() * 0.2;
    };

    for (let i = 0; i < EMBER_COUNT; i++) resetEmber(i, true);

    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));

    const emberMat = new THREE.PointsMaterial({
      color: 0xff8822,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const emberMesh = new THREE.Points(emberGeo, emberMat);
    scene.add(emberMesh);

    // ── FIRE GLOW ─────────────────────────────────────────────────────────────
    const glowGeo = new THREE.CircleGeometry(0.22, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff6010,
      transparent: true,
      opacity: 0.04,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, -3.0, 0.9);
    scene.add(glow);

    // ── ANIMATION ─────────────────────────────────────────────────────────────
    let frameId: number;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.016;

      starMat.uniforms.uTime.value = time;

      for (let i = 0; i < FIRE_COUNT; i++) {
        fireLife[i] -= 0.004;  // very slow decay
        firePos[i * 3]     += fireVel[i * 3] + Math.sin(time * 1.8 + i * 0.7) * 0.001;
        firePos[i * 3 + 1] += fireVel[i * 3 + 1];
        if (fireLife[i] <= 0) resetFire(i, false);
      }
      fireGeo.attributes.position.needsUpdate = true;
      fireMat.opacity = 0.42 + Math.sin(time * 3.5) * 0.10;  // subtle flicker

      for (let i = 0; i < EMBER_COUNT; i++) {
        emberLife[i] -= 0.003;
        emberPos[i * 3]     += emberVel[i * 3] + Math.sin(time * 2 + i) * 0.002;
        emberPos[i * 3 + 1] += emberVel[i * 3 + 1];
        if (emberLife[i] <= 0) resetEmber(i, false);
      }
      emberGeo.attributes.position.needsUpdate = true;
      emberMat.opacity = 0.55 + Math.sin(time * 4 + 1) * 0.15;

      glowMat.opacity = 0.025 + Math.sin(time * 4) * 0.012;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
