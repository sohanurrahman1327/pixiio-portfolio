import Link from "next/link";
import { pricingPlans } from "@/lib/content";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-5xl md:text-6xl text-center text-gray-900 tracking-wide mb-14">
          SELECT PACKAGE
        </h2>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl p-8 border flex flex-col ${
                plan.highlighted
                  ? "border-primary bg-gray-50 shadow-lg"
                  : "border-gray-100 bg-white"
              }`}
            >
              <header className="mb-6">
                <h3 className="font-display text-3xl text-gray-900 tracking-wide mb-2">
                  {plan.name}
                </h3>
                <p className="font-display text-5xl text-gray-900">{plan.price}</p>
                <p className="text-gray-400 text-xs mt-1">per project</p>
              </header>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`block text-center text-xs font-semibold tracking-wider py-3.5 rounded-full transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                CHOOSE PLAN
              </Link>
            </article>
          ))}
        </div>

        <aside className="bg-primary rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl text-white tracking-wide mb-2">
              NEED A CUSTOM PLAN?
            </h3>
            <p className="text-white/80 text-sm">
              We offer tailored packages for enterprise clients and long-term
              partnerships.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-white text-primary text-xs font-semibold tracking-wider px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            JOIN NOW
          </Link>
        </aside>
      </div>
    </section>
  );
}
