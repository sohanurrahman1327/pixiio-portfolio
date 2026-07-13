import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import StartProjectButton from "@/components/StartProjectButton";
import Testimonial from "@/components/Testimonial";
import WhyChooseUs from "@/components/WhyChooseUs";
import { stats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Why Choose Us — Pixiio Design Agency",
  description:
    "Discover why brands trust Pixiio for design-first UI, branding, and web experiences.",
};

export default function WhyUsPage() {
  return (
    <PageShell>
      <PageHero
        label="THE PIXIIO DIFFERENCE"
        title="WHY CHOOSE US"
        description="We're not just designers — we're partners invested in your brand's success. Here's what sets Pixiio apart from the rest."
      />

      <section className="py-16 bg-background border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl md:text-5xl text-primary tracking-wide">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-2 tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs showHeading={false} />

      <Testimonial />

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl text-gray-900 tracking-wide mb-4">
            LET&apos;S WORK TOGETHER
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Join 120+ brands that trust Pixiio to deliver design that converts.
          </p>
          <StartProjectButton />
        </div>
      </section>
    </PageShell>
  );
}
