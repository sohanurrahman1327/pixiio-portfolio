"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

function scheduleResize(lenis: Lenis) {
  requestAnimationFrame(() => {
    lenis.resize();
    requestAnimationFrame(() => lenis.resize());
  });
}

function waitForPreloaderSkipped() {
  return new Promise<void>((resolve) => {
    if (document.documentElement.classList.contains("preloader-skipped")) {
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains("preloader-skipped")) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
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
    let cancelled = false;
    let rafId = 0;
    let classObs: MutationObserver | null = null;
    let bodyObs: ResizeObserver | null = null;
    const resizeTimers: number[] = [];
    let handleLenisResize: (() => void) | null = null;

    void (async () => {
      await waitForPreloaderSkipped();
      if (cancelled) return;

      try {
        const lenis = new Lenis({
          content: document.body,
          duration: 0.9,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.5,
          infinite: false,
        });

        if (cancelled) {
          lenis.destroy();
          return;
        }

        lenisRef.current = lenis;
        (window as Window & { __lenis?: Lenis }).__lenis = lenis;

        const raf = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        scheduleResize(lenis);

        resizeTimers.push(
          ...[100, 400, 900, 1800, 3500].map((ms) =>
            window.setTimeout(() => scheduleResize(lenis), ms)
          )
        );

        handleLenisResize = () => scheduleResize(lenis);
        window.addEventListener("lenis:resize", handleLenisResize);
        window.addEventListener("load", handleLenisResize);
        document.fonts?.ready.then(handleLenisResize);

        const pageContent = document.getElementById("page-content");
        if (pageContent) {
          classObs = new MutationObserver(() => {
            window.setTimeout(() => scheduleResize(lenis), 100);
          });
          classObs.observe(pageContent, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }

        bodyObs = new ResizeObserver(() => scheduleResize(lenis));
        bodyObs.observe(document.body);
      } catch (error) {
        console.warn("[SmoothScroll] Lenis failed to start, using native scroll.", error);
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeTimers.forEach(clearTimeout);
      classObs?.disconnect();
      bodyObs?.disconnect();
      if (handleLenisResize) {
        window.removeEventListener("lenis:resize", handleLenisResize);
        window.removeEventListener("load", handleLenisResize);
      }
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
