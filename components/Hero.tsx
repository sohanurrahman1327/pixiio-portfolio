"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HeroMarquee from "@/components/HeroMarquee";

/* ─── Animated counter hook ─── */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ─── Animated button ─── */
function AnimatedButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className="group inline-flex items-center gap-3 bg-primary text-white text-[13px] font-bold tracking-[0.12em] uppercase pl-2 pr-7 py-2 rounded-full hover:bg-primary-dark transition-colors overflow-hidden"
      >
        <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shrink-0 overflow-hidden">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 bg-surface-elevated text-navy text-[13px] font-bold tracking-[0.12em] uppercase pl-6 pr-2 py-2 rounded-full border border-gray-200 hover:border-primary transition-colors overflow-hidden"
    >
      {children}
      <span className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 group-hover:border-primary shrink-0 overflow-hidden transition-colors">
        <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </Link>
  );
}

/* ─── Stat counter ─── */
function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(target);
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary text-base font-bold">✦</span>
      <span className="text-navy text-base font-bold">
        <span ref={ref}>{count}</span>{suffix}
      </span>
      <span className="text-gray-500 text-base">{label}</span>
    </div>
  );
}

/* ─── Trusted badge ─── */
function TrustedBadge() {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
            <Image src={`/image-0${i}.jpg`} alt={`Client ${i}`} width={40} height={40} className="object-cover w-full h-full" />
          </div>
        ))}
        <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-[10px] font-bold">
          +10
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-navy">Since 2025</p>
        <p className="text-sm text-gray-500">Trusted by 10+ Successful Clients.</p>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="bg-surface-muted">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Left: Marquee ──
              The marquee is absolutely positioned inside a relative container.
              The container height = right column height (via grid row stretch).
              Marquee gets 80px top/bottom padding via its own internal fades. */}
          <div className="hidden lg:block relative">
            <HeroMarquee />
          </div>

          {/* ── Right: Content ── drives the row height */}
          <div className="flex flex-col justify-center py-[100px]">
            <TrustedBadge />

            <h1 className="font-display text-[clamp(3.8rem,7.5vw,6.5rem)] leading-[0.92] tracking-wide text-navy mb-6">
              WE DESIGN
              <br />
              BRANDS THAT
              <br />
              LEAD &amp; INSPIRE
            </h1>

            <p className="text-gray-500 text-base leading-relaxed max-w-md mb-8">
              Pixiio is a design led creative design agency crafting digital
              experiences that drive real impact and measurable growth.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <AnimatedButton href="/contact" variant="primary">
                START A PROJECT
              </AnimatedButton>
              <AnimatedButton href="/work" variant="outline">
                VIEW WORK
              </AnimatedButton>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <StatItem target={150} suffix="+" label="Projects Completed" />
              <StatItem target={100} suffix="%" label="Client Satisfaction" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
