"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const [state, setState] = useState<"default" | "hover" | "fire">("default");

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    let raf: number;
    const lerp = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);

    // hover state
    const addHover = () => setState("hover");
    const removeHover = () => setState("default");
    const targets = document.querySelectorAll(
      "a, button, .stack-pill, .project-card"
    );
    targets.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    // fire zone
    const hero = document.getElementById("hero");
    const onHeroMove = (e: Event) => {
      const me = e as MouseEvent;
      const r = hero!.getBoundingClientRect();
      const dx = me.clientX - r.left - r.width / 2;
      const dy = me.clientY - r.top - r.height * 0.62;
      if (Math.sqrt(dx * dx + dy * dy) < 85) {
        setState("fire");
      } else {
        setState((s) => (s === "fire" ? "default" : s));
      }
    };
    hero?.addEventListener("mousemove", onHeroMove);
    hero?.addEventListener("mouseleave", () =>
      setState((s) => (s === "fire" ? "default" : s))
    );

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      hero?.removeEventListener("mousemove", onHeroMove);
    };
  }, []);

  const dotSize =
    state === "hover" ? "6px" : state === "fire" ? "14px" : "10px";
  const dotColor =
    state === "hover"
      ? "var(--color-moss-lt)"
      : state === "fire"
      ? "#ff6020"
      : "var(--color-sand)";
  const ringSize =
    state === "hover" ? "52px" : state === "fire" ? "60px" : "36px";
  const ringColor =
    state === "hover"
      ? "rgba(122,148,85,0.55)"
      : state === "fire"
      ? "rgba(255,96,32,0.5)"
      : "rgba(201,169,122,0.45)";

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference transition-[width,height,background] duration-150"
        style={{ width: dotSize, height: dotSize, background: dotColor }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-9998 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,border-color] duration-200"
        style={{
          width: ringSize,
          height: ringSize,
          border: `1px solid ${ringColor}`,
        }}
      />
    </>
  );
}