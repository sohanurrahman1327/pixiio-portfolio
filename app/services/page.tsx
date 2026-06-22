import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import StartProjectButton from "@/components/StartProjectButton";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services — Pixiio Design Agency",
  description:
    "UI design, branding, website design, and marketing services for modern brands.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        label="WHAT WE DO"
        title="OUR SERVICES"
        description="End-to-end design services — from brand identity and UI design to live websites and marketing assets that help your business grow."
      />

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {services.map((service, index) => (
            <article
              key={service.title}
              className={`grid lg:grid-cols-2 gap-10 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide mb-4">
                  {service.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {service.longDescription}
                </p>
                <h3 className="text-xs font-bold tracking-wider text-gray-900 mb-3">
                  WHAT YOU GET
                </h3>
                <ul className="space-y-2 mb-8">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="text-primary">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <StartProjectButton />
              </div>
              <figure
                className={`rounded-3xl overflow-hidden border border-gray-100 shadow-lg aspect-[4/3] ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  width={900}
                  height={650}
                  className="object-cover w-full h-full"
                />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm mb-6">
            Not sure which service fits? We&apos;ll help you choose on a free call.
          </p>
          <Link
            href="/contact"
            className="text-xs font-semibold tracking-wider text-primary hover:underline"
          >
            Book a free discovery call →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
