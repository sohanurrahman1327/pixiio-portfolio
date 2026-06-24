"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

function scheduleResize(lenis: Lenis) {
  requestAnimationFrame(() => {
    lenis.resize();
    requestAnimationFrame(() => lenis.resize());
  });
}

/**
 * Lenis smooth scroll — global singleton.
 *
 * Uses document.body as scroll content so full page height (incl. footer
 * outside <main>) is measured correctly. Re-measures on layout shifts,
 * preloader reveal, and explicit lenis:resize events.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      content: document.body,
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    // RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    scheduleResize(lenis);

    const resizeTimers = [100, 400, 900, 1800, 3500].map((ms) =>
      window.setTimeout(() => scheduleResize(lenis), ms)
    );

    const handleLenisResize = () => scheduleResize(lenis);
    window.addEventListener("lenis:resize", handleLenisResize);
    window.addEventListener("load", handleLenisResize);
    document.fonts?.ready.then(handleLenisResize);

    const pageContent = document.getElementById("page-content");
    let classObs: MutationObserver | null = null;
    if (pageContent) {
      classObs = new MutationObserver(() => {
        window.setTimeout(() => scheduleResize(lenis), 100);
      });
      classObs.observe(pageContent, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    const bodyObs = new ResizeObserver(() => scheduleResize(lenis));
    bodyObs.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      resizeTimers.forEach(clearTimeout);
      classObs?.disconnect();
      bodyObs.disconnect();
      window.removeEventListener("lenis:resize", handleLenisResize);
      window.removeEventListener("load", handleLenisResize);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
