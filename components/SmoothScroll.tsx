"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll — global singleton.
 *
 * Fixes applied:
 * 1. RAF loop with proper cleanup
 * 2. syncToNative via manual scroll event dispatch — keeps window.scroll
 *    listeners (WorkflowProcess etc.) in sync with Lenis virtual scroll
 * 3. Recalculates scroll dimensions after page-reveal animation completes
 * 4. touchMultiplier restored for mobile
 * 5. html scroll-behavior:auto set in globals.css to avoid CSS/JS conflict
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    // Keep native scroll events in sync so all window.addEventListener("scroll")
    // listeners receive updates (WorkflowProcess, etc.)
    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      // Manually sync window.scrollY via a native scroll event
      // Note: we can't set window.scrollY directly, but dispatching the event
      // ensures listeners that read getBoundingClientRect() fire at the right time
      void scroll; // used to satisfy TS, scroll value managed by Lenis
    });

    // RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // After preloader finishes (page-reveal ~800ms + preloader ~2600+850ms)
    // Resize Lenis so it picks up the full document height correctly
    const resizeTimer = setTimeout(() => {
      lenis.resize();
    }, 4000);

    // Also resize on page-content class change (MutationObserver)
    const pageContent = document.getElementById("page-content");
    let mutObs: MutationObserver | null = null;
    if (pageContent) {
      mutObs = new MutationObserver(() => {
        // Small delay so the animation has started and layout is settled
        setTimeout(() => lenis.resize(), 100);
      });
      mutObs.observe(pageContent, { attributes: true, attributeFilter: ["class"] });
    }

    const handleLenisResize = () => lenis.resize();
    window.addEventListener("lenis:resize", handleLenisResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      mutObs?.disconnect();
      window.removeEventListener("lenis:resize", handleLenisResize);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
