"use client";

import { useEffect } from "react";

/**
 * When the document is hidden (e.g. preview panes, background tabs),
 * Framer Motion can't fire rAF-based animations and elements stay at
 * opacity: 0. This component adds a CSS class after hydration so a
 * stylesheet rule can override the stuck inline styles.
 */
export function FallbackCheck() {
  useEffect(() => {
    if (document.hidden) {
      document.documentElement.classList.add("fm-fallback");
    }
  }, []);
  return null;
}
