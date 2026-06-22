"use client";

import Link from "next/link";
import Image from "next/image";
import { whyChooseReasons } from "@/lib/content";
import { useBooking } from "@/lib/booking-context";

/* ─── Reusable animated button — matches Hero / CTABanner style ─── */
function AnimatedButton({
  href,
  onClick,
  children,
  dark = false,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const className = `group inline-flex items-center gap-3 text-[13px] font-bold tracking-[0.12em] uppercase pl-2 pr-6 py-2 rounded-full transition-colors overflow-hidden
    ${dark
      ? "bg-surface-elevated text-gray-900 hover:bg-gray-100"
      : "bg-primary text-white hover:bg-primary-dark"
    }`;

  const inner = (
    <>
      <span className={`relative flex items-center justify-center w-9 h-9 rounded-full shrink-0 overflow-hidden
        ${dark ? "bg-gray-900" : "bg-white"}`}
      >
        {/* icon slides out left on hover, re-enters from right */}
        <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12L12 4M12 4H6M12 4V10"
              stroke={dark ? "#ffffff" : "#5b5fef"}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12L12 4M12 4H6M12 4V10"
              stroke={dark ? "#ffffff" : "#5b5fef"}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      {children}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={href ?? "/"} className={className}>
      {inner}
    </Link>
  );
}

export default function WhyChooseUs() {
  const { open } = useBooking();
  return (
    <section id="why-us" className="bg-gray-50 py-[50px] md:py-[80px] lg:py-30">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-[30px] lg:gap-[42px]">

        <h2 className="font-display text-5xl md:text-6xl text-center text-gray-900 tracking-wide">
          WHY CHOOSE US
        </h2>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* ── Card 1: large left — Design-First, spans 5 cols & 2 rows ── */}
          <article className="md:col-span-5 md:row-span-2 bg-surface-elevated rounded-3xl p-8 border border-gray-100 flex flex-col overflow-hidden">
            <h3 className="font-display text-3xl text-gray-900 tracking-wide">
              {whyChooseReasons[0].title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              {whyChooseReasons[0].description}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed mt-1">
              {whyChooseReasons[0].detail}
            </p>
            {/* Real image — UI design preview */}
            <div className="mt-6 flex-1 relative rounded-2xl overflow-hidden min-h-[200px]">
              <Image
                src="/image-07.jpg"
                alt="UI design project preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              {/* Floating balance card overlay */}
              <div className="absolute bottom-4 left-4 bg-surface-elevated/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg">
                <div className="text-[10px] text-gray-400 mb-0.5">Design-led results</div>
                <div className="text-base font-bold text-gray-900">120+ Projects</div>
              </div>
            </div>
          </article>

          {/* ── Card 2: Expert Team, spans 4 cols ── */}
          <article className="md:col-span-4 bg-surface-elevated rounded-3xl p-7 border border-gray-100 flex flex-col overflow-hidden">
            <h3 className="font-display text-2xl text-gray-900 tracking-wide">
              {whyChooseReasons[1].title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              {whyChooseReasons[1].description}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed mt-1">
              {whyChooseReasons[1].detail}
            </p>
            {/* Team / collaboration preview image */}
            <div className="mt-5 relative rounded-2xl overflow-hidden h-36">
              <Image
                src="/image-02.jpg"
                alt="Expert design team collaboration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gray-900/40" />
              {/* tool icon row overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                {["Figma", "AI", "PS", "XD"].map((tool) => (
                  <span key={tool} className="bg-white/90 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* ── Card 3: Fast Delivery, spans 3 cols — accent tint ── */}
          <article className="md:col-span-3 bg-surface-muted rounded-3xl p-7 border border-indigo-100 flex flex-col">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white text-lg mb-3 shrink-0">
              ◎
            </div>
            <h3 className="font-display text-2xl text-gray-900 tracking-wide">
              {whyChooseReasons[2].title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              {whyChooseReasons[2].description}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed mt-1">
              {whyChooseReasons[2].detail}
            </p>
            {/* Speed stat pill */}
            <div className="mt-auto pt-6 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-primary/20 overflow-hidden">
                <div className="h-full w-4/5 rounded-full bg-primary" />
              </div>
              <span className="text-primary text-xs font-bold shrink-0">5-Day avg</span>
            </div>
          </article>

          {/* ── Card 4: Dedicated Support, spans 7 cols ── */}
          <article className="md:col-span-7 bg-surface-elevated rounded-3xl p-7 border border-gray-100 flex flex-col overflow-hidden">
            <h3 className="font-display text-2xl text-gray-900 tracking-wide">
              {whyChooseReasons[3].title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              {whyChooseReasons[3].description}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed mt-1">
              {whyChooseReasons[3].detail}
            </p>
            {/* Support / process image */}
            <div className="mt-5 relative rounded-2xl overflow-hidden h-36">
              <Image
                src="/image-04.jpg"
                alt="Dedicated design support"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent" />
              {/* 24/7 badge */}
              <div className="absolute top-3 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                24/7 WhatsApp Support
              </div>
            </div>
          </article>

          {/* ── Card 5: Proven Results, spans 8 cols ── */}
          <article className="md:col-span-8 bg-surface-elevated rounded-3xl p-8 border border-gray-100 flex flex-col overflow-hidden">
            <h3 className="font-display text-2xl text-gray-900 tracking-wide">
              {whyChooseReasons[4].title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mt-3 max-w-md">
              {whyChooseReasons[4].description}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed mt-1 max-w-sm">
              {whyChooseReasons[4].detail}
            </p>
            {/* Portfolio strip — 3 real images */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {["/image-01.jpg", "/image-10.jpg", "/branding.png"].map((src, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden h-24">
                  <Image
                    src={src}
                    alt={`Proven result ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                </div>
              ))}
            </div>
          </article>

          {/* ── CTA card: brand primary bg + stripe shape, spans 4 cols ── */}
          <article
            className="md:col-span-4 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative"
            style={{ background: "#5b5fef" }}
          >
            {/* Vertical stripe overlay — kept from original design */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.07) 10px, rgba(255,255,255,0.07) 12px)",
              }}
            />
            {/* Soft glow blob */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.12)", filter: "blur(40px)" }}
            />

            <div className="relative z-10">
              <h3 className="font-display text-3xl text-white tracking-wide leading-tight">
                Unlock The Power of Strategy-Driven Design and Growth.
              </h3>
            </div>

            <div className="relative z-10 mt-8">
              <AnimatedButton onClick={open} dark>
                LET&apos;S TALK
              </AnimatedButton>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
