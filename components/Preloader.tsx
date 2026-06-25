"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const SESSION_KEY = "pixiio-preloader-seen";
const ROTATION_MS = 2400;
const HOLD_MS = 250;
const LOGO_MS = 500;
const EXIT_MS = 450;
const COUNTER_EXIT_MS = 400;
const TEXT_MS = ROTATION_MS + HOLD_MS;
const TOTAL_MS = TEXT_MS + LOGO_MS;

const TEXT_PARTS = ["Agency", "Creative", "Led", "Design", "Pixiio"] as const;
const SEGMENT_COUNT = TEXT_PARTS.length;

import { isSharedPreviewHost } from "@/lib/network";

type PreloaderPhase = "playing" | "logo" | "counter-exiting" | "exiting" | "hidden";

function revealPage() {
  document.documentElement.classList.remove("preloader-pending");
  document.documentElement.classList.add("preloader-skipped");
  document.getElementById("page-content")?.classList.add("page-revealed");
}

function RotatingTextCylinder() {
  return (
    <div
      className="preloader-3d-scene"
      style={{ "--segment-count": SEGMENT_COUNT } as React.CSSProperties}
    >
      <div className="preloader-3d-cylinder" aria-hidden="true">
        {TEXT_PARTS.map((part, index) => (
          <span
            key={`${part}-${index}`}
            className={`preloader-3d-face${index === SEGMENT_COUNT - 1 ? " preloader-3d-face--brand" : ""}`}
            style={{ "--i": index } as React.CSSProperties}
          >
            {part}
          </span>
        ))}
      </div>
    </div>
  );
}

function PreloaderHeroLogo() {
  return (
    <div className="preloader-hero-logo" aria-hidden="true">
      <div className="flex h-32 w-32 items-center justify-center rounded-full border-[5px] border-white bg-primary shadow-xl shadow-primary/40">
        <svg
          width="64"
          height="64"
          viewBox="30.5 24.8 39 50.4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M67.9385 55.7363C68.5411 55.1955 69.4997 55.6229 69.5 56.4326V68.3936C69.5 72.129 66.4718 75.1572 62.7363 75.1572C62.5496 75.1572 62.3984 75.0061 62.3984 74.8193V61.1592C62.3984 60.8754 62.5185 60.6047 62.7295 60.415L67.9385 55.7363ZM59.0947 24.8428C59.3599 24.8428 59.6142 24.9483 59.8018 25.1357L69.207 34.541C69.3945 34.7285 69.5 34.9829 69.5 35.248V47.7559C69.5 48.0355 69.3825 48.3028 69.1768 48.4922L59.7871 57.1338C59.6079 57.2987 59.3744 57.3933 59.1309 57.3984L51.3818 57.5615C50.8217 57.5731 50.3615 57.1228 50.3613 56.5625V49.1943C50.3615 48.6422 50.8091 48.1943 51.3613 48.1943H55.3984C55.713 48.1942 56.0094 48.0466 56.1982 47.7949L59.3096 43.6465C59.4392 43.4735 59.5087 43.263 59.5088 43.0469V39.4609C59.5088 39.1959 59.4041 38.9414 59.2168 38.7539L56.1914 35.7285C56.004 35.5411 55.7494 35.4357 55.4844 35.4355H42.5742C42.0219 35.4355 41.5742 35.8833 41.5742 36.4355V51.6855L49.707 59.8184C49.8945 60.0059 50 60.2602 50 60.5254V72.7432C50 73.6341 48.9229 74.0802 48.293 73.4502L41.7471 66.9043C41.5596 66.7168 41.4542 66.4624 41.4541 66.1973V51.5654L30.793 40.9043C30.6055 40.7168 30.5 40.4624 30.5 40.1973V25.8428C30.5 25.2905 30.9477 24.8428 31.5 24.8428H59.0947Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}

export default function Preloader() {
  const [phase, setPhase] = useState<PreloaderPhase>("hidden");
  const [count, setCount] = useState(0);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const finishAndReveal = useCallback(() => {
    revealPage();
    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("hidden");
  }, []);

  const startExit = useCallback(() => {
    setPhase("counter-exiting");
    exitTimerRef.current = setTimeout(() => {
      setPhase("exiting");
      exitTimerRef.current = setTimeout(finishAndReveal, EXIT_MS);
    }, COUNTER_EXIT_MS);
  }, [finishAndReveal]);

  useLayoutEffect(() => {
    if (isSharedPreviewHost() || sessionStorage.getItem(SESSION_KEY)) {
      revealPage();
      if (isSharedPreviewHost()) {
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    }
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isSharedPreviewHost() || sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    if (reducedMotion) {
      revealPage();
      sessionStorage.setItem(SESSION_KEY, "1");
      return;
    }

    setPhase("playing");
    sequenceTimerRef.current = setTimeout(() => {
      setPhase("logo");
      sequenceTimerRef.current = setTimeout(startExit, LOGO_MS);
    }, TEXT_MS);

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(now - start, TOTAL_MS);
      const eased = 1 - Math.pow(1 - elapsed / TOTAL_MS, 3);
      setCount(Math.round(eased * 100));

      if (elapsed < TOTAL_MS) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(100);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [startExit]);

  if (phase === "hidden") return null;

  const showText = phase === "playing";
  const showLogo = phase === "logo" || phase === "counter-exiting" || phase === "exiting";

  return (
    <div
      aria-hidden="true"
      className="preloader-shell fixed inset-0 z-[9999] overflow-hidden bg-background"
      data-phase={phase}
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 select-none">
        {showText && <RotatingTextCylinder />}
        {showLogo && <PreloaderHeroLogo />}
      </div>

      <div className="preloader-counter" data-phase={phase} aria-hidden="true">
        <span className="preloader-counter__value tabular-nums">{count}</span>
        <span className="preloader-counter__symbol">%</span>
      </div>
    </div>
  );
}
