"use client";

import { useEffect, useState } from "react";
import { personalInfo, typewriterLines } from "@/data";
import { Button } from "@/components/ui";
import CampfireScene from "@/components/three/CampfireScene";

function useTypewriter(lines: string[], speed = 65) {
  const [text,      setText]      = useState("");
  const [lineIdx,   setLineIdx]   = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const current = lines[lineIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx === 0) {
      timer = setTimeout(() => {
        setDeleting(false);
        setLineIdx((i) => (i + 1) % lines.length);
      }, 400);
    } else {
      timer = setTimeout(() => {
        const next = deleting ? charIdx - 1 : charIdx + 1;
        setCharIdx(next);
        setText(current.slice(0, next));
      }, deleting ? speed / 2 : speed);
    }

    return () => clearTimeout(timer);
  }, [lines, lineIdx, charIdx, deleting, speed]);

  return text;
}

export function HeroSection() {
  const typed = useTypewriter(typewriterLines);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <CampfireScene />

      {/* Gradient overlay so text stays readable */}
      {/* <div className="absolute inset-0 bg-linear-to-b from-bg/30 via-transparent to-bg/80 pointer-events-none" /> */}

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Eyebrow */}
        <div className="inline-block font-mono text-sm tracking-[0.25em] uppercase text-black bg-moss-lt px-4 py-2 rounded-sm mb-6 opacity-80">
          Hello, I&apos;m
        </div>

        {/* Name */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-cream leading-none mb-4">
          {personalInfo.name.split(" ")[0]}{" "}
          <span className="italic text-sand">
            {personalInfo.name.split(" ").slice(1).join(" ")}
          </span>
        </h1>

        {/* Typewriter */}
        <div className="font-mono text-sm sm:text-base tracking-wider text-text2 h-6 mb-8">
          {typed}
          <span className="ml-0.5 inline-block w-0.5 h-4 bg-sand align-middle animate-[blink_1s_step-end_infinite]" />
        </div>

        {/* Tagline */}
        <p className="font-body text-text2 text-sm sm:text-base max-w-sm mb-10 leading-relaxed">
          {personalInfo.tagline}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Work
          </Button>
          <Button
            variant="secondary"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </section>
  );
}
