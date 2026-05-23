"use client";

import { cn } from "@/lib/utils";
import { AnchorHTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";

// ── BUTTON ──────────────────────────────────────────────
interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-block font-mono text-xs tracking-widest uppercase px-7 py-3 rounded-sm border transition-colors duration-200 cursor-none select-none",
        variant === "primary" &&
          "bg-sand text-bg border-sand hover:bg-cream hover:border-cream",
        variant === "secondary" &&
          "bg-transparent text-text-2 border-border-2 hover:border-sand hover:text-sand",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

// ── BADGE ────────────────────────────────────────────────
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-[0.7rem] tracking-wider uppercase px-3 py-1 rounded-sm border",
        "text-coffee-lt bg-coffee-dim border-coffee-dim",
        className
      )}
    >
      {children}
    </span>
  );
}

// ── SECTION EYEBROW ──────────────────────────────────────
export function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.12em] uppercase text-moss-lt mb-4">
      {label}
      <span className="h-px w-20 bg-color-border" />
    </div>
  );
}

// ── DIVIDER ──────────────────────────────────────────────
export function Divider() {
  return <div className="h-px bg-border" />;
}

// ── REVEAL ON SCROLL ─────────────────────────────────────
// Native IO + CSS — no hydration mismatch:
// server renders opacity-0, client hydrates with the same opacity-0,
// then the observer fires after mount and flips to opacity-100.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "-80px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] ease-out duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        className
      )}
      style={{ transitionDelay: visible ? `${delay * 1000}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

// ── CURRENT TAG ──────────────────────────────────────────
export function CurrentTag() {
  return (
    <span className="inline-block font-mono text-[0.65rem] tracking-wider uppercase px-2 py-0.5 rounded-sm bg-moss-dim text-moss-lt">
      Current
    </span>
  );
}

// ── STACK PILL ───────────────────────────────────────────
export function StackPill({
  children,
  highlight = false,
}: {
  children: ReactNode;
  highlight?: boolean;
}) {
  return (
    <span
      className={cn(
        "stack-pill font-mono text-[0.78rem] tracking-wider px-4 py-2 rounded-sm border transition-colors duration-200 cursor-none",
        highlight
          ? "text-moss-lt border-moss-dim"
          : "text-text-2 border-border bg-bg-3",
        "hover:border-sand hover:text-sand hover:bg-surface"
      )}
    >
      {children}
    </span>
  );
}

// ── PROJECT TAG ──────────────────────────────────────────
export function ProjectTag({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.62rem] tracking-wider border border-color-border text-color-text3 px-2 py-0.5 rounded-sm">
      {children}
    </span>
  );
}