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
    camera.position.set(0, -0.8, 6);
    camera.lookAt(0, -0.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Circular soft texture for fire/ember particles
    const makeCircleTex = () => {
      const c = document.createElement("canvas");
      c.width = 32; c.height = 32;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0,   "rgba(255,255,255,1)");
      g.addColorStop(0.4, "rgba(255,255,255,0.6)");
      g.addColorStop(1,   "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(c);
    };
    const circleTex = makeCircleTex();

    const darkMat   = new THREE.MeshBasicMaterial({ color: 0x100c08 });
    const tentMat   = new THREE.MeshBasicMaterial({ color: 0x0c0806 }); // tent — dark silhouette

    // ── STARS ────────────────────────────────────────────────────────────────
    const STAR_COUNT = 420;
    const starPos   = new Float32Array(STAR_COUNT * 3);
    const starPhase = new Float32Array(STAR_COUNT);
    const starSize  = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 22;
      starPos[i * 3 + 1] = Math.random() * 8 + 0.4;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      starPhase[i]       = Math.random() * Math.PI * 2;
      starSize[i]        = Math.random() * 0.55 + 0.15;
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
          vOpacity = 0.55 + 0.45 * abs(sin(uTime * 0.6 + aPhase));
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (165.0 / -mvPos.z);
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

    scene.add(new THREE.Points(starGeo, starMat));

    // ── MILKY WAY BAND ───────────────────────────────────────────────────────
    const MW_COUNT = 200;
    const mwPos = new Float32Array(MW_COUNT * 3);
    for (let i = 0; i < MW_COUNT; i++) {
      const t = (i / MW_COUNT) * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 1.4;
      mwPos[i * 3]     = Math.cos(t * 0.3) * 8 + spread * 2;
      mwPos[i * 3 + 1] = Math.sin(t * 0.15) * 2 + spread + 3.5;
      mwPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    const mwGeo = new THREE.BufferGeometry();
    mwGeo.setAttribute("position", new THREE.BufferAttribute(mwPos, 3));
    scene.add(new THREE.Points(mwGeo, new THREE.PointsMaterial({
      color: 0xd4b882, size: 0.032, transparent: true, opacity: 0.28, sizeAttenuation: true,
    })));

    // ── BACKGROUND MOUNTAINS ─────────────────────────────────────────────────
    const bgShape = new THREE.Shape();
    bgShape.moveTo(-14, -6);
    bgShape.lineTo(-11,  0.2);
    bgShape.lineTo(-8.5, -1.0);
    bgShape.lineTo(-5.5,  2.6);   // tall left peak
    bgShape.lineTo(-3.0, -0.2);   // valley
    bgShape.lineTo(-1.0,  1.2);   // secondary peak
    bgShape.lineTo( 1.0, -0.8);   // valley center
    bgShape.lineTo( 5.5,  3.4);   // tallest peak (dominant, right of center)
    bgShape.lineTo( 8.0,  0.4);
    bgShape.lineTo( 10.5, 1.4);
    bgShape.lineTo( 14, -6);
    bgShape.closePath();
    const bgMountain = new THREE.Mesh(
      new THREE.ShapeGeometry(bgShape),
      new THREE.MeshBasicMaterial({ color: 0x221a12 })
    );
    bgMountain.position.z = -0.5;
    scene.add(bgMountain);

    // ── FOREGROUND TERRAIN (trees + clearing) ────────────────────────────────
    const GROUND = -2.95;

    const fgShape = new THREE.Shape();
    fgShape.moveTo(-12, -5);
    fgShape.lineTo(-7.5, -0.5);
    fgShape.lineTo(-6.0, -1.8);
    fgShape.lineTo(-4.5,  0.1);
    fgShape.lineTo(-3.8, -1.4);
    fgShape.lineTo(-3.0, -0.9);
    fgShape.lineTo(-2.5, GROUND);
    fgShape.lineTo( 3.2, GROUND);
    fgShape.lineTo( 3.8, -1.0);
    fgShape.lineTo( 4.5,  0.1);
    fgShape.lineTo( 6.0, -1.8);
    fgShape.lineTo( 7.5, -0.5);
    fgShape.lineTo( 12,  -5);
    fgShape.closePath();
    const fgMesh = new THREE.Mesh(new THREE.ShapeGeometry(fgShape), darkMat);
    fgMesh.position.z = 0.4;
    scene.add(fgMesh);

    // ── TENT SILHOUETTE ───────────────────────────────────────────────────────
    // Tent close to the fire (on the left), door facing right toward the flames
    const tCX = -0.45;
    const tHalf = 0.62;
    const tH = 0.80;

    const tentShape = new THREE.Shape();
    tentShape.moveTo(tCX - tHalf, GROUND);
    tentShape.lineTo(tCX - 0.04,  GROUND + tH);
    tentShape.lineTo(tCX + tHalf, GROUND);
    tentShape.closePath();
    const tentMesh = new THREE.Mesh(new THREE.ShapeGeometry(tentShape), tentMat);
    tentMesh.position.z = 0.4;
    scene.add(tentMesh);

    // Door — right face, opening toward campfire
    const doorShape = new THREE.Shape();
    doorShape.moveTo(tCX + 0.10, GROUND);
    doorShape.lineTo(tCX + 0.25, GROUND + 0.36);
    doorShape.lineTo(tCX + 0.50, GROUND);
    doorShape.closePath();
    const doorMesh = new THREE.Mesh(
      new THREE.ShapeGeometry(doorShape),
      new THREE.MeshBasicMaterial({ color: 0x181008 })
    );
    doorMesh.position.z = 0.41;
    scene.add(doorMesh);

    // ── CAMPFIRE LOGS ─────────────────────────────────────────────────────────
    // Fire moved to the right side of the clearing
    const fireX = 0.85;

    // Logs at z=1.2 (same depth as fire particles) to avoid perspective offset
    const logMat = new THREE.MeshBasicMaterial({ color: 0x1c1008 });
    const addLog = (s: THREE.Shape) => {
      const m = new THREE.Mesh(new THREE.ShapeGeometry(s), logMat);
      m.position.z = 1.19;
      m.renderOrder = 1;
      scene.add(m);
    };

    // Log A — horizontal base
    const logA = new THREE.Shape();
    logA.moveTo(fireX - 0.32, GROUND - 0.01);
    logA.lineTo(fireX + 0.32, GROUND + 0.04);
    logA.lineTo(fireX + 0.32, GROUND + 0.07);
    logA.lineTo(fireX - 0.32, GROUND + 0.02);
    logA.closePath();
    addLog(logA);

    // Log B — diagonal, tilted left (upper-right to lower-left)
    const logB = new THREE.Shape();
    logB.moveTo(fireX - 0.28, GROUND + 0.10);
    logB.lineTo(fireX + 0.28, GROUND - 0.02);
    logB.lineTo(fireX + 0.28, GROUND + 0.02);
    logB.lineTo(fireX - 0.28, GROUND + 0.14);
    logB.closePath();
    addLog(logB);

    // Log C — diagonal, tilted right (lower-left to upper-right)
    const logC = new THREE.Shape();
    logC.moveTo(fireX - 0.28, GROUND - 0.01);
    logC.lineTo(fireX + 0.28, GROUND + 0.10);
    logC.lineTo(fireX + 0.28, GROUND + 0.14);
    logC.lineTo(fireX - 0.28, GROUND + 0.03);
    logC.closePath();
    addLog(logC);

    // Log D — short top log
    const logD = new THREE.Shape();
    logD.moveTo(fireX - 0.16, GROUND + 0.06);
    logD.lineTo(fireX + 0.16, GROUND + 0.06);
    logD.lineTo(fireX + 0.16, GROUND + 0.10);
    logD.lineTo(fireX - 0.16, GROUND + 0.10);
    logD.closePath();
    addLog(logD);

    // ── FIRE GLOW ─────────────────────────────────────────────────────────────
    // Warm halo (~130px radius on screen) — gives the scene warmth without dominating
    // At z=1.0 (depth=5), world radius 0.85 → ~133px on a 900px screen
    const glowWideMat = new THREE.MeshBasicMaterial({
      color: 0xff5500, transparent: true, opacity: 0.14,
    });
    const glowWide = new THREE.Mesh(new THREE.CircleGeometry(0.65, 28), glowWideMat);
    glowWide.position.set(fireX, GROUND + 0.18, 1.0);
    scene.add(glowWide);

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff8800, transparent: true, opacity: 0.42,
    });
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 20), glowMat);
    glow.position.set(fireX, GROUND + 0.10, 1.12);
    scene.add(glow);

    const glowCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffdd00, transparent: true, opacity: 0.70,
    });
    const glowCore = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), glowCoreMat);
    glowCore.position.set(fireX, GROUND + 0.04, 1.20);
    scene.add(glowCore);

    // ── FIRE PARTICLES ────────────────────────────────────────────────────────
    const FIRE_COUNT = 90;
    const firePos  = new Float32Array(FIRE_COUNT * 3);
    const fireVel  = new Float32Array(FIRE_COUNT * 3);
    const fireLife = new Float32Array(FIRE_COUNT);
    const fireCol  = new Float32Array(FIRE_COUNT * 3);

    const resetFire = (i: number, randomY = false) => {
      firePos[i * 3]     = fireX + (Math.random() - 0.5) * 0.26;
      firePos[i * 3 + 1] = GROUND + (randomY ? Math.random() * 0.7 : 0);
      firePos[i * 3 + 2] = 1.2;
      fireVel[i * 3]     = (Math.random() - 0.5) * 0.004;
      fireVel[i * 3 + 1] = 0.003 + Math.random() * 0.005;
      fireLife[i] = 0.65 + Math.random() * 0.35;
      const heat = Math.random();
      fireCol[i * 3]     = 1.0;
      fireCol[i * 3 + 1] = 0.15 + heat * 0.55;
      fireCol[i * 3 + 2] = heat * 0.05;
    };

    for (let i = 0; i < FIRE_COUNT; i++) resetFire(i, true);

    const fireGeo = new THREE.BufferGeometry();
    fireGeo.setAttribute("position", new THREE.BufferAttribute(firePos, 3));
    fireGeo.setAttribute("color",    new THREE.BufferAttribute(fireCol, 3));
    const fireMat = new THREE.PointsMaterial({
      size: 0.12, transparent: true, opacity: 0.80,
      vertexColors: true, sizeAttenuation: true, depthWrite: false,
      map: circleTex, alphaTest: 0.01,
    });
    scene.add(new THREE.Points(fireGeo, fireMat));

    // ── EMBERS ────────────────────────────────────────────────────────────────
    const EMBER_COUNT = 20;
    const emberPos  = new Float32Array(EMBER_COUNT * 3);
    const emberVel  = new Float32Array(EMBER_COUNT * 3);
    const emberLife = new Float32Array(EMBER_COUNT);

    const resetEmber = (i: number, randomY = false) => {
      emberPos[i * 3]     = fireX + (Math.random() - 0.5) * 0.22;
      emberPos[i * 3 + 1] = GROUND + (randomY ? Math.random() * 0.8 : 0);
      emberPos[i * 3 + 2] = 1.3;
      emberVel[i * 3]     = (Math.random() - 0.5) * 0.008;
      emberVel[i * 3 + 1] = 0.007 + Math.random() * 0.010;
      emberLife[i] = 0.8 + Math.random() * 0.2;
    };

    for (let i = 0; i < EMBER_COUNT; i++) resetEmber(i, true);

    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xff9933, size: 0.05, transparent: true, opacity: 0.85,
      sizeAttenuation: true, depthWrite: false,
      map: circleTex, alphaTest: 0.01,
    });
    scene.add(new THREE.Points(emberGeo, emberMat));

    // ── ANIMATION ─────────────────────────────────────────────────────────────
    let frameId: number;
    let time = 0;
    const firePosAttr  = fireGeo.attributes.position  as THREE.BufferAttribute;
    const emberPosAttr = emberGeo.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.016;

      starMat.uniforms.uTime.value = time;

      for (let i = 0; i < FIRE_COUNT; i++) {
        fireLife[i] -= 0.007;
        firePos[i * 3]     += fireVel[i * 3] + Math.sin(time * 2.0 + i * 0.7) * 0.0013;
        firePos[i * 3 + 1] += fireVel[i * 3 + 1];
        if (fireLife[i] <= 0) resetFire(i, false);
      }
      firePosAttr.needsUpdate = true;
      fireMat.opacity = 0.65 + Math.sin(time * 3.8) * 0.15;

      for (let i = 0; i < EMBER_COUNT; i++) {
        emberLife[i] -= 0.006;
        emberPos[i * 3]     += emberVel[i * 3] + Math.sin(time * 2.3 + i) * 0.002;
        emberPos[i * 3 + 1] += emberVel[i * 3 + 1];
        if (emberLife[i] <= 0) resetEmber(i, false);
      }
      emberPosAttr.needsUpdate = true;
      emberMat.opacity = 0.60 + Math.sin(time * 4.5 + 1) * 0.18;

      glowWideMat.opacity  = 0.11  + Math.sin(time * 2.2) * 0.03;
      glowMat.opacity      = 0.36  + Math.sin(time * 3.0) * 0.08;
      glowCoreMat.opacity  = 0.62  + Math.sin(time * 4.2) * 0.12;

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

  return (
    <div className="absolute inset-0">
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
