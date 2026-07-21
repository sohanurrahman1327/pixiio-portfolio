import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PricingSection from "@/components/Pricing";
import Bonuses from "@/components/Bonuses";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for UI design, development, and branding packages. Launch, Growth, and Signature plans available.",
  alternates: { canonical: "/pricing" },
};

const comparisons = [
  { feature: "High-Fidelity UI Design", basic: true, pro: true, elite: true },
  { feature: "Figma Prototype & Design System", basic: true, pro: true, elite: true },
  { feature: "Development (Framer/Webflow/WordPress)", basic: false, pro: true, elite: true },
  { feature: "Hosting, Domain & Analytics Setup", basic: false, pro: true, elite: true },
  { feature: "SEO Setup", basic: false, pro: false, elite: true },
  { feature: "Logo & Brand Essentials", basic: false, pro: false, elite: true },
  { feature: "Maintenance (2–3 Months)", basic: false, pro: true, elite: true },
  { feature: "Unlimited Revisions", basic: true, pro: true, elite: true },
];

export default function PricingPage() {
  return (
    <PageShell>
      <PricingSection />

      <Bonuses />

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
                    LAUNCH
                  </th>
                  <th className="p-4 text-xs font-bold tracking-wider text-primary">
                    GROWTH
                  </th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-900">
                    SIGNATURE
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
