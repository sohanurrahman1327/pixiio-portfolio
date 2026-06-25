"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { testimonialAvatar } from "@/lib/images";

type TestimonialItem = {
  id: string;
  label: string;
  image: string;
  imageAlt: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  stat: string;
  statLabel: string;
};

const testimonials: TestimonialItem[] = [
  {
    id: "techflow",
    label: "TechFlow",
    image: "/image-07.jpg",
    imageAlt: "TechFlow Inc. digital presence redesign",
    quote:
      "They have transformed our digital presence. Their attention to detail and design-led approach is truly unmatched in the industry today.",
    name: "James Carter",
    role: "CEO, TechFlow Inc.",
    avatar: testimonialAvatar,
    stat: "98%",
    statLabel: "Client satisfaction across all delivered projects",
  },
  {
    id: "olivia",
    label: "Olivia Studio",
    image: "/image-01.jpg",
    imageAlt: "Olivia Studio brand identity project",
    quote:
      "Pixiio captured our creative vision perfectly. The brand identity they built feels authentic, polished, and instantly recognizable across every touchpoint.",
    name: "Sarah Mitchell",
    role: "Founder, Olivia Studio",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=90",
    stat: "3×",
    statLabel: "Increase in brand recognition after rebrand launch",
  },
  {
    id: "grovallo",
    label: "Grovallo",
    image: "/image-10.jpg",
    imageAlt: "Grovallo Agency website redesign",
    quote:
      "Our new website exceeded every expectation. Clean design, fast performance, and a portfolio that finally does our work justice. Leads started coming in within weeks.",
    name: "Marcus Chen",
    role: "Creative Director, Grovallo",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=90",
    stat: "40%",
    statLabel: "More inbound leads within the first quarter",
  },
  {
    id: "design-that-sells",
    label: "Design That Sells",
    image: "/image-02.jpg",
    imageAlt: "Design That Sells landing page project",
    quote:
      "The landing page Pixiio designed converted from day one. Every section was intentional — the copy, layout, and visuals all worked together to drive sign-ups.",
    name: "Emma Rodriguez",
    role: "Marketing Lead, Design That Sells",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=90",
    stat: "2.5×",
    statLabel: "Higher conversion rate on the new landing page",
  },
];

export default function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let next = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        next = (index + 1) % testimonials.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        next = (index - 1 + testimonials.length) % testimonials.length;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = testimonials.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      setActiveIndex(next);
      document.getElementById(`testimonial-tab-${testimonials[next].id}`)?.focus();
    },
    []
  );

  return (
    <section className="relative bg-surface-muted border-y border-border-subtle py-[50px] md:py-[80px] lg:py-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--primary) 8%, transparent), transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col gap-[30px] lg:gap-[42px]">

        <header className="flex flex-col items-center text-center gap-4 md:gap-5">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1l1.2 2.4L10 4l-2 1.9.5 2.8L6 7.4 3.5 8.7 4 5.9 2 4l2.8-.6L6 1z" fill="currentColor" />
            </svg>
            Success Stories
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-wide">
            REAL STORIES, REAL SUCCESS
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed">
            Hear from the brands we&apos;ve partnered with — real results from design-led
            collaboration.
          </p>
        </header>

        <article
          id="testimonial-panel"
          role="tabpanel"
          aria-labelledby={`testimonial-tab-${active.id}`}
          key={active.id}
          className="bg-surface-elevated rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2 animate-[fade-up_0.35s_ease-out]"
        >
          <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]">
            <Image
              src={active.image}
              alt={active.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <span className="absolute top-5 left-5 inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] font-bold tracking-[0.15em] uppercase px-3.5 py-2 rounded-full shadow-sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 10V5.5C3 3.57 4.57 2 6.5 2S10 3.57 10 5.5V10M3 10H10M3 10L2 12M10 10L11 12" stroke="#5b5fef" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Client Story
            </span>

            <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-lg max-w-[220px]">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 12V6M6 12V4M10 12V8M14 12V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-2xl font-bold text-gray-900 leading-none">{active.stat}</span>
              </div>
              <p className="text-xs text-gray-500 leading-snug">{active.statLabel}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
            <svg
              className="text-primary mb-5"
              width="40"
              height="32"
              viewBox="0 0 40 32"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M0 32V19.2C0 11.52 2.56 5.76 7.68 2.24L11.52 6.4C8.96 8.32 7.68 10.56 7.68 13.12H12.8V32H0zm22.4 0V19.2c0-7.68 2.56-13.44 7.68-16.96L34.56 6.4C32 8.32 30.72 10.56 30.72 13.12H35.84V32H22.4z" />
            </svg>

            <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed">
              {active.quote}
            </blockquote>

            <hr className="border-gray-100 my-6" />

            <footer className="flex items-center gap-3.5">
              <figure className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-gray-100">
                <Image
                  src={active.avatar}
                  alt={active.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </figure>
              <cite className="not-italic">
                <p className="text-gray-900 text-sm font-semibold">{active.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{active.role}</p>
              </cite>
            </footer>
          </div>
        </article>

        <div
          className="bg-surface-elevated/80 backdrop-blur-sm rounded-2xl border border-border-subtle px-4 py-3 md:px-6 md:py-4"
          role="tablist"
          aria-label="Client testimonials"
        >
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {testimonials.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="tab"
                    id={`testimonial-tab-${item.id}`}
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    aria-controls="testimonial-panel"
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={`w-full rounded-xl px-3 py-3.5 md:px-4 md:py-4 text-center transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 border border-primary/25 shadow-sm"
                        : "bg-transparent border border-transparent hover:bg-gray-50 hover:border-gray-100"
                    }`}
                  >
                    <span
                      className={`font-display text-sm md:text-lg tracking-wider uppercase block transition-colors leading-tight ${
                        isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </section>
  );
}
