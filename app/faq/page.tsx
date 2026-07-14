import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import FAQ from "@/components/FAQ";
import WhatsappButton from "@/components/WhatsappButton";
import { faqs } from "@/lib/content";
import { faqPageSchema, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Quick Help & FAQ",
  description:
    "Answers to common questions about our design services, process, pricing, and timelines.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqPageSchema(faqs))}
      />
      <PageHero
        label="SUPPORT"
        title="QUICK HELP"
        description="Find answers to the most common questions about working with Pixiio. Still need help? We're one message away."
      />

      <FAQ showTitle={false} />

      <section className="py-16 bg-background border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl text-gray-900 tracking-wide mb-3">
            STILL HAVE QUESTIONS?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Our team typically responds within a few hours on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WhatsappButton />
            <Link
              href="/contact"
              className="text-xs font-semibold tracking-wider text-gray-900 border border-gray-200 px-6 py-3 rounded-full hover:border-gray-300 transition-colors"
            >
              CONTACT FORM
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
