"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setProgress(total > 0 ? (current / total) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-0.5 z-200 transition-[width] duration-75 ease-linear"
      style={{
        width: `${progress}%`,
        background:
          "linear-gradient(90deg, var(--color-moss-lt), var(--color-sand), var(--color-coffee-lt))",
        boxShadow: "0 0 8px rgba(201,169,122,0.45)",
      }}
    />
  );
}
