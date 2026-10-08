"use client";
// Smooth scrolling for the wheel, and a page that changes its tone section by section.
// Kept short on purpose: the page follows the wheel within a few frames instead of gliding
// on for a second. Touch keeps the platform's own scrolling, and reduced motion gets none.
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

export function Smooth() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, autoRaf: true, anchors: { offset: -72 } });
    return () => lenis.destroy();
  }, []);

  // the section in the middle of the screen names the tone of the page (see .paper in globals.css)
  useEffect(() => {
    const root = document.documentElement;
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) root.dataset.tone = (e.target as HTMLElement).dataset.tone;
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-tone]").forEach((el) => seen.observe(el));
    return () => {
      seen.disconnect();
      delete root.dataset.tone;
    };
  }, []);

  return null;
}
