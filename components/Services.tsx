"use client";

import Link from "next/link";
import WorkImageLens from "@/components/WorkImageLens";
import { services } from "@/lib/content";

/* ─── Per-service tags ─── */
const serviceTags: Record<string, string[]> = {
  "UI DESIGN": [
    "Wireframing",
    "User Flow",
    "Hi-Fi UI Design",
    "Design System",
    "Prototyping",
    "UX Research",
  ],
  BRANDING: [
    "Brand Strategy",
    "Logo Design",
    "Visual Identity",
    "Brand Guidelines",
    "Brand Collateral",
    "Rebranding",
  ],
  WEBSITE: [
    "Web Design",
    "Responsive Design",
    "CMS Development",
    "E-commerce",
    "Landing Pages",
    "Web Optimization",
  ],
  MARKETING: [
    "Social Media Marketing",
    "Ad Campaigns",
    "Content Strategy",
    "Email Marketing",
    "SEO",
    "Analytics & Reporting",
  ],
};

/* ─── Service background colors ─── */
const serviceBgColors: Record<string, string> = {
  "UI DESIGN": "bg-blue-50 dark:bg-blue-500/10",
  BRANDING: "bg-purple-50 dark:bg-purple-500/10",
  WEBSITE: "bg-green-50 dark:bg-green-500/10",
  MARKETING: "bg-orange-50 dark:bg-orange-500/10",
};

/* ─── Animated button icon (same as Hero) ─── */
function ServiceIcon() {
  return (
    <>
      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </>
  );
}

export default function Services() {
  return (
    <section id="services" className="bg-background py-[50px] md:py-[80px] lg:py-30">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary mb-3 uppercase">
            Services
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-navy tracking-wide">
            We Help Build Up Brands
          </h2>
        </div>

        {/* ── Alternating Service Items ── */}
        <div className="space-y-16">
          {services.map((service, idx) => {
            const tags = serviceTags[service.title] ?? [];
            const isEven = idx % 2 === 0;
            const bgColor = serviceBgColors[service.title] || "bg-gray-50";

            return (
              <div
                key={service.title}
                className={`${bgColor} rounded-3xl p-8 md:p-12 lg:p-8 ${
                  !isEven ? "lg:[direction:rtl]" : ""
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* ── Content Section ── */}
                  <div className={!isEven ? "lg:[direction:ltr]" : ""}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group inline-block"
                    >
                      <h3 className="font-display text-5xl md:text-6xl lg:text-7xl text-navy tracking-wide mb-6 uppercase font-bold transition-all duration-300 ease-out group-hover:text-primary">
                        {service.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 dark:text-white/65 text-sm md:text-base leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Tags Grid - Larger, Rounded Pills */}
                    <div className="flex flex-wrap gap-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-gray-700 dark:text-white/85 bg-white dark:bg-white/10 rounded-full px-4 py-2 shadow-sm dark:shadow-none border border-gray-100/80 dark:border-white/10"
                        >
                          <span className="text-primary text-xs">✦</span>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── Image Section ── */}
                  <div className={`relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg group ${!isEven ? "lg:[direction:ltr]" : ""}`}>
                    <WorkImageLens
                      src={service.image}
                      alt={`${service.title} service showcase`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* ── Icon Circle at Bottom (Hero Button Style) ── */}
                    <Link
                      href={`/services/${service.slug}`}
                      className="group/icon absolute bottom-6 right-6 z-20 w-14 h-14 rounded-full bg-surface-elevated shadow-lg flex items-center justify-center text-primary transition-all duration-300 hover:bg-primary hover:text-white overflow-hidden"
                    >
                      <ServiceIcon />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
