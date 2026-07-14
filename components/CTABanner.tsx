"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import CTAChipPlayground from "@/components/CTAChipPlayground";

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

export default function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const notify = () => window.dispatchEvent(new Event("lenis:resize"));
    notify();
    const t1 = window.setTimeout(notify, 150);
    const t2 = window.setTimeout(notify, 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-navy-solid overflow-hidden min-h-[700px] h-[700px] md:h-[720px]"
    >
      {/* Content — pointer-events-none so chips can be grabbed over the full section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-[50px] md:pt-[80px] pb-10 md:py-28 flex flex-col items-center justify-start md:justify-center text-center pointer-events-none h-full">
        <h2 className="font-display text-[clamp(2.85rem,13.5vw,4.25rem)] md:text-[clamp(3.8rem,7.5vw,6.5rem)] leading-[0.92] md:leading-[0.92] tracking-wide text-white mb-4 md:mb-6 w-full max-w-[22rem] md:max-w-none mx-auto">
          READY TO BUILD
          <br />
          YOUR NEXT{" "}
          <br className="md:hidden" />
          <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            DIGITAL PRODUCT?
          </span>
        </h2>

        <p className="text-gray-300 text-sm md:text-base leading-snug md:leading-relaxed max-w-[19rem] md:max-w-2xl mx-auto mb-6 md:mb-8 line-clamp-3 md:line-clamp-none">
          We help ambitious brands launch websites, landing pages, SaaS products & digital
          experiences that generate measurable business growth.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-36 md:mb-0 relative z-30 pointer-events-auto">
          <AnimatedButton href="/contact" variant="primary">
            BOOK A DISCOVERY CALL
          </AnimatedButton>
          <span className="hidden md:contents">
            <AnimatedButton href="/work" variant="outline">
              VIEW WORK
            </AnimatedButton>
          </span>
        </div>
      </div>

      {/* Physics playground — full section, top to bottom */}
      <CTAChipPlayground sectionRef={sectionRef} />
    </section>
  );
}
