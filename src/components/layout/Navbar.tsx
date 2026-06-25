"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const links = [
  { label: "About",      href: "#about" },
  { label: "Work",       href: "#experience" },
  { label: "Stack",      href: "#stack" },
  { label: "Projects",   href: "#projects" },
  { label: "Contact",    href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [open,     setOpen]       = useState(false);
  const [active,   setActive]     = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLink = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border bg-bg/80 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleLink("#hero"); }}
            className="flex items-center gap-2 font-mono text-sm tracking-[0.15em] uppercase text-sand hover:text-cream transition-colors duration-200"
          >
            <Image src="/icon.svg" alt="" width={20} height={20} className="h-5 w-5" />
            <h1 className="mt-1.5">
              LDM
            </h1>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => { e.preventDefault(); handleLink(href); }}
                className={cn(
                  "font-mono text-[0.72rem] tracking-widest uppercase transition-colors duration-200",
                  active === href.slice(1)
                    ? "text-sand"
                    : "text-text2 hover:text-text"
                )}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="md:hidden relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 hover:bg-text2/10 active:scale-95"
          >
            <span className="relative flex h-4 w-5 flex-col items-center justify-between">
              <span
                className={cn(
                  "block h-[1.5px] w-full origin-center rounded-full bg-text2 transition-all duration-300 ease-[cubic-bezier(.65,0,.35,1)]",
                  open ? "translate-y-1.75 rotate-45 bg-sand" : ""
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-full rounded-full bg-text2 transition-all duration-200",
                  open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-full origin-center rounded-full bg-text2 transition-all duration-300 ease-[cubic-bezier(.65,0,.35,1)]",
                  open ? "-translate-y-1.75 -rotate-45 bg-sand" : ""
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={cn(
          "fixed inset-0 z-40 bg-bg/95 backdrop-blur-lg flex flex-col items-center justify-center gap-10 transition-all duration-400 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {links.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => { e.preventDefault(); handleLink(href); }}
            className="font-display text-3xl font-light text-text hover:text-sand transition-colors duration-200"
          >
            {label}
          </a>
        ))}
      </div>
    </>
  );
}
