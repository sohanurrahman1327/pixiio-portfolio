import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import PricingSection from "@/components/Pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for UI design, branding, and website packages. Basic, Pro, and Elite plans available.",
  alternates: { canonical: "/pricing" },
};

const comparisons = [
  { feature: "Landing Page Design", basic: true, pro: true, elite: true },
  { feature: "Full Website Design", basic: false, pro: true, elite: true },
  { feature: "Brand Identity", basic: false, pro: true, elite: true },
  { feature: "Marketing Assets", basic: false, pro: false, elite: true },
  { feature: "Unlimited Revisions", basic: false, pro: true, elite: true },
  { feature: "Dedicated Designer", basic: false, pro: false, elite: true },
];

export default function PricingPage() {
  return (
    <PageShell>
      <PageHero
        label="INVEST IN DESIGN"
        title="PRICING"
        description="Simple, transparent packages with no hidden fees. Pick the plan that fits your stage — or contact us for a custom quote."
      />

      <PricingSection />

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl text-center text-gray-900 tracking-wide mb-10">
            COMPARE PLANS
          </h2>
          <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-surface-elevated">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 text-xs font-bold tracking-wider text-gray-400">
                    FEATURE
                  </th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-900">
                    BASIC
                  </th>
                  <th className="p-4 text-xs font-bold tracking-wider text-primary">
                    PRO
                  </th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-900">
                    ELITE
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-50">
                    <td className="p-4 text-gray-600">{row.feature}</td>
                    {[row.basic, row.pro, row.elite].map((val, i) => (
                      <td key={i} className="p-4 text-center">
                        {val ? (
                          <span className="text-primary">✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
