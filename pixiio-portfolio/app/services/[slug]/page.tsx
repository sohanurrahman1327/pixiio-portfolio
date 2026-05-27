"use client";

import { services } from "@/lib/content";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";

/* ─── Process steps for each service ─── */
const processSteps: Record<string, Array<{ title: string; description: string; icon: string }>> = {
  "ui-design": [
    {
      title: "Discovery & Research",
      description: "We start by understanding your users, competitors, and business goals through interviews and market analysis.",
      icon: "🔍",
    },
    {
      title: "Wireframing & User Flows",
      description: "Creating low-fidelity wireframes and mapping user journeys to establish the structure and logic of your interface.",
      icon: "📐",
    },
    {
      title: "High-Fidelity Design",
      description: "Building beautiful, pixel-perfect UI screens with your brand colors, typography, and design system components.",
      icon: "🎨",
    },
    {
      title: "Interactive Prototype",
      description: "Creating clickable prototypes in Figma so you can experience the flow and interactions before development.",
      icon: "⚡",
    },
    {
      title: "Design System & Handoff",
      description: "Documenting all components, styles, and specifications for seamless developer handoff and future scalability.",
      icon: "📦",
    },
  ],
  branding: [
    {
      title: "Brand Strategy",
      description: "Defining your brand positioning, values, personality, and target audience through strategic workshops.",
      icon: "🎯",
    },
    {
      title: "Logo Design",
      description: "Creating multiple logo concepts in Illustrator, refined through feedback until we nail your brand mark.",
      icon: "✏️",
    },
    {
      title: "Visual Identity",
      description: "Developing a complete color palette, typography system, and visual language that represents your brand.",
      icon: "🌈",
    },
    {
      title: "Brand Guidelines",
      description: "Documenting all brand standards in a comprehensive PDF guide for consistent application across touchpoints.",
      icon: "📋",
    },
    {
      title: "Brand Collateral",
      description: "Creating business cards, letterheads, social media templates, and other branded assets ready to use.",
      icon: "📄",
    },
  ],
  website: [
    {
      title: "Website Strategy",
      description: "Planning site structure, user flows, and content hierarchy based on your business goals and audience needs.",
      icon: "🗺️",
    },
    {
      title: "Web Design",
      description: "Designing responsive, modern website layouts in Figma with attention to UX, performance, and brand consistency.",
      icon: "🎨",
    },
    {
      title: "Development",
      description: "Building your site on WordPress, Framer, or providing developer-ready exports with clean, semantic code.",
      icon: "💻",
    },
    {
      title: "SEO & Optimization",
      description: "Implementing SEO best practices, optimizing images, and ensuring fast load times for better search rankings.",
      icon: "🚀",
    },
    {
      title: "Launch & Support",
      description: "Deploying your site, testing across devices, and providing training and support for ongoing maintenance.",
      icon: "🎉",
    },
  ],
  marketing: [
    {
      title: "Marketing Strategy",
      description: "Analyzing your market, competitors, and audience to develop a targeted marketing and content strategy.",
      icon: "📊",
    },
    {
      title: "Social Media Design",
      description: "Creating scroll-stopping social media posts, stories, and reels that align with your brand and drive engagement.",
      icon: "📱",
    },
    {
      title: "Ad Creatives",
      description: "Designing high-converting ad banners and creatives for Facebook, Instagram, Google, and other platforms.",
      icon: "📢",
    },
    {
      title: "Email & Landing Pages",
      description: "Building email templates and landing page variants optimized for conversions and brand consistency.",
      icon: "✉️",
    },
    {
      title: "Analytics & Reporting",
      description: "Tracking performance metrics, analyzing results, and providing monthly reports with actionable insights.",
      icon: "📈",
    },
  ],
};

/* ─── Animated button icon (same as Hero) ─── */
function AnimatedArrowIcon() {
  return (
    <>
      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </>
  );
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const steps = processSteps[params.slug] || [];

  return (
    <PageShell>
      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-[#eef0fb] to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <p className="text-[11px] font-bold tracking-[0.25em] text-primary mb-3 uppercase">
                {service.title}
              </p>
              <h1 className="font-display text-[clamp(3.8rem,7.5vw,6.5rem)] leading-[0.92] tracking-wide text-[#0f1a3d] mb-6">
                {service.longDescription}
              </h1>
              <p className="text-gray-600 text-base leading-relaxed max-w-md mb-8">
                We deliver comprehensive {service.title.toLowerCase()} solutions tailored to your unique business needs and goals.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-primary text-white text-[13px] font-bold tracking-[0.12em] uppercase pl-2 pr-7 py-2 rounded-full hover:bg-primary-dark transition-colors overflow-hidden"
              >
                <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shrink-0 overflow-hidden">
                  <AnimatedArrowIcon />
                </span>
                START PROJECT
              </Link>
            </div>

            {/* Right: Image */}
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Process Section ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary mb-3 uppercase">
              Our Process
            </p>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#0f1a3d] tracking-wide">
              How We Work
            </h2>
          </div>

          {/* Process Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-[#eef0fb] to-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                {/* Step Number */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4">{step.icon}</div>

                {/* Content */}
                <h3 className="font-display text-2xl text-[#0f1a3d] mb-3 uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 h-1 bg-primary rounded-full w-0 group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deliverables Section ── */}
      <section className="bg-[#eef0fb] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1">
              <Image
                src={service.image}
                alt={`${service.title} deliverables`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Right: Content */}
            <div className="order-1 lg:order-2">
              <p className="text-[11px] font-bold tracking-[0.25em] text-primary mb-3 uppercase">
                What You Get
              </p>
              <h2 className="font-display text-5xl md:text-6xl text-[#0f1a3d] tracking-wide mb-8">
                Deliverables
              </h2>

              <ul className="space-y-4">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="text-primary text-xl font-bold mt-1">✦</span>
                    <span className="text-gray-700 text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-primary text-white text-[13px] font-bold tracking-[0.12em] uppercase pl-2 pr-7 py-2 rounded-full hover:bg-primary-dark transition-colors overflow-hidden mt-8"
              >
                <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shrink-0 overflow-hidden">
                  <AnimatedArrowIcon />
                </span>
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#0f1a3d] tracking-wide mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            Let's discuss your project, timeline, and budget. We'll create a custom proposal tailored to your needs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-primary text-white text-[13px] font-bold tracking-[0.12em] uppercase pl-2 pr-7 py-2 rounded-full hover:bg-primary-dark transition-colors overflow-hidden"
            >
              <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shrink-0 overflow-hidden">
                <AnimatedArrowIcon />
              </span>
              START A PROJECT
            </Link>
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 bg-white text-[#0f1a3d] text-[13px] font-bold tracking-[0.12em] uppercase pl-6 pr-2 py-2 rounded-full border border-gray-200 hover:border-primary transition-colors overflow-hidden"
            >
              VIEW OUR WORK
              <span className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 group-hover:border-primary shrink-0 overflow-hidden transition-colors">
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#0f1a3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
