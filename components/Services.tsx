"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

interface CardStackProps {
  service: (typeof services)[0];
  index: number;
}

function CardStack({ service, index }: CardStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stackOffsets, setStackOffsets] = useState([0, 0, 0]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far down the container is in the viewport (0 to 1)
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - rect.top) / (viewportHeight + rect.height)
      ));

      // Stack cards as you scroll: they move up and overlap
      // Card 2 (back) moves first, then card 1, then card 0 (front)
      const offsets = [
        Math.max(0, scrollProgress * 60 - 40), // Card 0 (front) - starts moving later
        Math.max(0, scrollProgress * 60 - 20), // Card 1 (middle)
        Math.max(0, scrollProgress * 60),      // Card 2 (back) - starts moving first
      ];

      setStackOffsets(offsets);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-w-0 h-[400px] relative"
      style={{ perspective: "1000px" }}
    >
      {/* Stack of 3 cards */}
      {[2, 1, 0].map((offset) => (
        <div
          key={offset}
          className="absolute inset-0 rounded-3xl overflow-hidden border border-gray-100 transition-transform duration-300"
          style={{
            transform: `translateY(${stackOffsets[offset]}px) translateX(${offset * 0}px)`,
            zIndex: 10 - offset,
          }}
        >
          <Image
            src={service.image}
            alt={`${service.title} service showcase`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary mb-3 uppercase">
            Services
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#0f1a3d] tracking-wide">
            We Help Build Up Brands
          </h2>
        </div>

        {/* ── Alternating Service Items with Scroll-Triggered Stack ── */}
        <div className="space-y-12">
          {services.map((service, idx) => {
            const tags = serviceTags[service.title] ?? [];
            const isEven = idx % 2 === 0;
            const row1 = tags.slice(0, 3);
            const row2 = tags.slice(3, 6);

            return (
              <div
                key={service.title}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}
              >
                {/* ── Content (Left or Right) ── */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-4xl md:text-5xl text-[#0f1a3d] tracking-wide mb-4 uppercase">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-md">
                    {service.description}
                  </p>

                  {/* Tags */}
                  <div className="space-y-2">
                    {[row1, row2].map((row, ri) => (
                      <div key={ri} className="flex flex-wrap gap-2">
                        {row.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5"
                          >
                            <span className="text-primary text-[10px]">✦</span>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Scroll-Triggered Stacked Cards ── */}
                <CardStack service={service} index={idx} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
