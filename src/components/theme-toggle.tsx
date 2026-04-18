"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Toggles the `.theme-light` class on <body>. CSS overrides in globals.css
 * flip the homepage palette (charcoal ↔ cream) when active. Respects an
 * initial value saved to localStorage.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("kidbrook-theme");
    if (stored === "light") setIsLight(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.classList.toggle("theme-light", isLight);
    localStorage.setItem("kidbrook-theme", isLight ? "light" : "dark");
  }, [isLight, mounted]);

  return (
    <button
      onClick={() => setIsLight((v) => !v)}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`flex h-10 w-10 items-center justify-center text-cream/70 transition-colors hover:text-gold ${className ?? ""}`}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
