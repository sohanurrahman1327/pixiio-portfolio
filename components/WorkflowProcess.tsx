"use client";

import { useEffect, useRef, useState } from "react";
import { designProcessSteps } from "@/lib/images";

const BULLETS: string[][] = [
  [
    "Research and create a custom plan.",
    "Align with your business goals.",
    "Develop a roadmap for smooth execution.",
  ],
  [
    "Sketch layouts and user flows on paper.",
    "Define content hierarchy and navigation.",
    "Validate ideas before moving to digital.",
  ],
  [
    "Choose from two tailored design directions.",
    "Refine the selected concept based on your vision.",
    "Move forward with confidence toward the final design.",
  ],
  [
    "Pixel-perfect Figma prototype ready for review.",
    "Interactive components and design system.",
    "Client presentation and feedback rounds.",
  ],
  [
    "Build and deploy fully responsive website.",
    "Comprehensive testing across devices and browsers.",
    "Smooth handover with documentation and support.",
  ],
];

const TRIGGER = 0.55; // fraction of viewport height where each circle "activates"

export default function WorkflowProcess() {
  const trackRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs  = useRef<(HTMLDivElement | null)[]>([]);

  // px height of filled portion of the track line
  const [fillHeight, setFillHeight] = useState(0);
  // which circles have been reached
  const [activeCount, setActiveCount] = useState(0);
  // per-step entrance animation
  const [visible, setVisible] = useState<boolean[]>(() =>
    designProcessSteps.map(() => false)
  );

  /* ── Scroll handler ─────────────────────────────────────────────────── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const trackRect  = track.getBoundingClientRect();
      const triggerY   = window.innerHeight * TRIGGER;

      // How many px from the top of the track to the trigger line
      const rawFill = triggerY - trackRect.top;
      const clipped = Math.min(Math.max(0, rawFill), trackRect.height);
      setFillHeight(clipped);

      // Activate each circle once the trigger line passes its centre
      let count = 0;
      circleRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const centre = r.top + r.height / 2;
        if (centre <= triggerY) count++;
      });
      setActiveCount(count);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* ── Per-step entrance via IntersectionObserver ─────────────────────── */
  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            o.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-surface-muted py-[50px] md:py-[80px] lg:py-30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-[30px] lg:grid lg:grid-cols-[1fr_1fr] lg:gap-[42px] items-start">

          {/* ── Left sticky ──────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-28 self-start">
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary uppercase mb-4">
              Our Process
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-gray-900 dark:text-navy tracking-wide leading-none mb-6">
              A PROVEN &amp; EFFECTIVE<br />WORKFLOW PROCESS.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              At Pixiio, we follow a structured and proven process to ensure
              the success of every project.
            </p>
          </div>

          {/* ── Right: steps ─────────────────────────────────────────── */}
          <div className="relative">

            {/* ── Vertical track — spans first-circle centre → last-circle centre ── */}
            {/* We wrap it in a relative container whose top/bottom align with circles */}
            <div
              ref={trackRef}
              className="absolute left-[19px] top-5 bottom-5 w-[2px] pointer-events-none"
              aria-hidden
            >
              {/* Grey rail */}
              <div className="absolute inset-0 bg-gray-200/60 rounded-full" />

              {/* Blue fill — driven by scroll, measured from track top */}
              <div
                className="absolute inset-0"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="absolute inset-x-0 top-0 bg-primary rounded-full"
                  style={{
                    height: fillHeight,
                    transition: "height 0.08s linear",
                  }}
                />
              </div>
            </div>

            {/* ── Step rows ── */}
            {designProcessSteps.map((step, i) => {
              const isActive = i < activeCount;
              const isLast   = i === designProcessSteps.length - 1;

              return (
                <div
                  key={step.step}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  className="relative flex gap-8"
                  style={{
                    paddingBottom: isLast ? 0 : "3.5rem",
                    opacity:    visible[i] ? 1 : 0,
                    transform:  visible[i] ? "translateY(0)" : "translateY(32px)",
                    transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                  }}
                >
                  {/* ── Circle ── */}
                  <div
                    className="relative z-10 flex-shrink-0"
                    style={{ width: 40 }}
                  >
                    <div
                      ref={(el) => { circleRefs.current[i] = el; }}
                      className="w-10 h-10 rounded-full border-2 bg-surface-elevated flex items-center justify-center"
                      style={{
                        borderColor:     isActive ? "var(--primary)" : "var(--gray-200)",
                        boxShadow:       isActive ? "0 0 0 4px rgba(91,95,239,0.12)" : "none",
                        transition:      "border-color 0.4s ease, box-shadow 0.4s ease",
                      }}
                    >
                      <span
                        className="text-[11px] font-bold tracking-wider"
                        style={{
                          color:      isActive ? "var(--primary)" : "var(--gray-400)",
                          transition: "color 0.4s ease",
                        }}
                      >
                        {step.step}
                      </span>
                    </div>
                  </div>

                  {/* ── Content ── */}
                  <div className="flex-1 pt-1 pb-2">
                    {/* Title row with corner bracket */}
                    <div className="relative mb-4">
                      <span
                        aria-hidden
                        className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2"
                        style={{
                          borderColor:  isActive ? "rgba(91,95,239,0.35)" : "color-mix(in srgb, var(--gray-200) 60%, transparent)",
                          transition:   "border-color 0.4s ease",
                        }}
                      />
                      <h3
                        className="font-display text-3xl md:text-4xl tracking-wide leading-tight pr-5 transition-colors duration-300"
                        style={{
                          color:      isActive ? "var(--foreground)" : "var(--gray-400)",
                          transition: "color 0.4s ease",
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Description — slides in when active */}
                    <div
                      style={{
                        overflow:   "hidden",
                        maxHeight:  isActive ? "200px" : "0px",
                        opacity:    isActive ? 1 : 0,
                        transition: "max-height 0.5s ease, opacity 0.45s ease",
                      }}
                    >
                      <p className="text-base text-gray-500 leading-relaxed mb-5 max-w-lg">
                        {step.description}
                      </p>
                      <ul className="space-y-2 pb-1">
                        {(BULLETS[i] ?? []).map((b) => (
                          <li
                            key={b}
                            className="text-sm text-gray-400 flex items-start gap-2"
                          >
                            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
