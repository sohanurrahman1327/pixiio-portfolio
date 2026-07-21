"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getPricingPlans, pricingTabs } from "@/lib/content";

const NOCODE_ADDON = 5000;

type PricingPlan = ReturnType<typeof getPricingPlans>[number];

/* ─── Format price number → "$X,XXX+" or "$XX" (custom/enterprise) ─── */
function formatPrice(n: number | null) {
  if (n === null) return "$XX";
  return "$" + n.toLocaleString("en-US") + "+";
}

/* ─── Build a /contact link that prefills the "Selected Package" field ─── */
function buildContactHref(packageName: string, price: number | null, pagesLabel?: string) {
  const params = new URLSearchParams({ package: packageName });
  if (price !== null) params.set("price", formatPrice(price));
  if (pagesLabel) params.set("pages", pagesLabel);
  return `/contact?${params.toString()}`;
}

/* ─── Feature-row icons ─── */
const featureIcons: Record<string, React.ReactNode> = {
  default: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
    </svg>
  ),
  person: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  clock: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  sparkle: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z" />
    </svg>
  ),
  repeat: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  card: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  ),
  layers: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  seo: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
};

function getIcon(feature: string) {
  const f = feature.toLowerCase();
  if (f.includes("designer") || f.includes("senior") || f.includes("dedicated")) return featureIcons.person;
  if (f.includes("day") || f.includes("week") || f.includes("timeline") || f.includes("delivery")) return featureIcons.clock;
  if (f.includes("revision")) return featureIcons.repeat;
  if (f.includes("payment") || f.includes("secure")) return featureIcons.card;
  if (f.includes("seo") || f.includes("optimiz")) return featureIcons.seo;
  if (f.includes("page") || f.includes("multi") || f.includes("concept")) return featureIcons.layers;
  if (f.includes("design") || f.includes("brand") || f.includes("prototype") || f.includes("figma")) return featureIcons.sparkle;
  return featureIcons.default;
}

/* ─── iOS-style toggle switch ─── */
function Toggle({
  enabled,
  onToggle,
  highlighted,
  label = "Enable No-code Development add-on",
}: {
  enabled: boolean;
  onToggle: () => void;
  highlighted?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
        ${enabled
          ? highlighted ? "bg-primary" : "bg-gray-700"
          : "bg-gray-200"
        }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200
          ${enabled ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

/* ─── No-code addon row ─── */
function NoCodeAddon({
  enabled,
  onToggle,
  highlighted,
}: {
  enabled: boolean;
  onToggle: () => void;
  highlighted?: boolean;
}) {
  return (
    <div className={`mt-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-colors
      ${enabled
        ? highlighted ? "bg-primary/8" : "bg-gray-50"
        : "bg-gray-50"
      }`}
      style={enabled && highlighted ? { backgroundColor: "rgba(91,95,239,0.06)" } : {}}
    >
      <span className={`text-sm font-medium transition-colors ${enabled ? "text-gray-900" : "text-gray-500"}`}>
        +No-code Development
      </span>
      <div className="flex items-center gap-2.5 shrink-0">
        <span className={`text-sm font-semibold transition-colors ${enabled ? (highlighted ? "text-primary" : "text-gray-900") : "text-gray-400"}`}>
          $5k
        </span>
        <Toggle enabled={enabled} onToggle={onToggle} highlighted={highlighted} />
      </div>
    </div>
  );
}

/* ─── Purchase Now / Book a Call button ─── */
function ScheduleButton({
  href,
  highlighted = false,
  label = "Purchase Now",
}: {
  href: string;
  highlighted?: boolean;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between transition-colors rounded-full pl-6 pr-2 py-2 w-full
        ${highlighted
          ? "bg-primary hover:bg-primary-dark text-white"
          : "bg-gray-900 hover:bg-gray-800 dark:bg-white/10 dark:hover:bg-white/15 text-white"
        }`}
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className={`relative flex items-center justify-center w-9 h-9 rounded-full bg-white shrink-0 overflow-hidden ${highlighted ? "text-primary" : "text-[#111111]"}`}>
        <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12L12 4M12 4H6M12 4V10"
              stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12L12 4M12 4H6M12 4V10"
              stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </Link>
  );
}

/* ─── Popular badge ─── */
function PopularBadge() {
  return (
    <span className="absolute top-5 right-5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary border border-primary/30 bg-primary/5 px-2.5 py-1 rounded-full">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      Popular
    </span>
  );
}

/* ─── Animated price display ─── */
function PriceDisplay({
  basePrice,
  addonEnabled,
  highlighted,
}: {
  basePrice: number | null;
  addonEnabled: boolean;
  highlighted?: boolean;
}) {
  const isCustom = basePrice === null;
  const total = !isCustom && addonEnabled ? basePrice + NOCODE_ADDON : basePrice;
  return (
    <div className="mt-5 flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          className={`text-4xl font-bold tabular-nums transition-all duration-300
            ${highlighted && addonEnabled ? "text-primary" : "text-gray-900"}`}
        >
          {formatPrice(total)}
        </span>
        {isCustom && <span className="text-gray-400 text-sm">Negotiation</span>}
      </div>
      {!isCustom && addonEnabled && (
        <span className={`self-start text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-300
          ${highlighted ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
          +$5k No-code Dev included
        </span>
      )}
    </div>
  );
}

/* ─── Highlighted card — animated spinning border ─── */
function HighlightedCard({ plan, pagesLabel }: { plan: PricingPlan; pagesLabel: string }) {
  const [noCode, setNoCode] = useState(false);
  const basePrice = plan.basePrice;
  const isCustom = basePrice === null;
  const total = basePrice !== null && noCode ? basePrice + NOCODE_ADDON : basePrice;
  return (
    <div className="relative p-[2px] rounded-3xl pricing-glow-border overflow-hidden">
      <article className="relative bg-surface-elevated rounded-[22px] p-8 flex flex-col h-full">
        <PopularBadge />

        <header className="mb-6 pr-20">
          <h3 className="font-bold text-xl text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{plan.idealFor}</p>
          <PriceDisplay basePrice={plan.basePrice} addonEnabled={noCode} highlighted />
        </header>

        <div className="w-full h-px bg-gray-100 mb-6" />

        <ul className="space-y-3.5 mb-8 flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-600">
              <span className="text-gray-400 shrink-0">{getIcon(feature)}</span>
              {feature}
            </li>
          ))}
        </ul>

        <ScheduleButton
          href={buildContactHref(plan.name, total, pagesLabel)}
          highlighted
          label={isCustom ? "Book a Call" : "Purchase Now"}
        />
        {!isCustom && (
          <NoCodeAddon enabled={noCode} onToggle={() => setNoCode((v) => !v)} highlighted />
        )}
      </article>
    </div>
  );
}

/* ─── Regular card ─── */
function RegularCard({ plan, pagesLabel }: { plan: PricingPlan; pagesLabel: string }) {
  const [noCode, setNoCode] = useState(false);
  const basePrice = plan.basePrice;
  const isCustom = basePrice === null;
  const total = basePrice !== null && noCode ? basePrice + NOCODE_ADDON : basePrice;
  return (
    <article className="relative bg-surface-elevated rounded-3xl p-8 border border-gray-100 flex flex-col h-full overflow-hidden">
      {/* Subtle top-left glow blob */}
      <div
        className="absolute -top-10 -left-10 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(91,95,239,0.07) 0%, transparent 70%)" }}
      />

      <header className="mb-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{plan.idealFor}</p>
        <PriceDisplay basePrice={plan.basePrice} addonEnabled={noCode} />
      </header>

      <div className="w-full h-px bg-gray-100 mb-6" />

      <ul className="space-y-3.5 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-600">
            <span className="text-gray-400 shrink-0">{getIcon(feature)}</span>
            {feature}
          </li>
        ))}
      </ul>

      <ScheduleButton
        href={buildContactHref(plan.name, total, pagesLabel)}
        label={isCustom ? "Book a Call" : "Purchase Now"}
      />
      {!isCustom && (
        <NoCodeAddon enabled={noCode} onToggle={() => setNoCode((v) => !v)} />
      )}
    </article>
  );
}

/* ─── Page-count tab selector ─── */
function TabSelector({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {pricingTabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-pressed={isActive}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors duration-200
              ${isActive
                ? "bg-primary border-primary text-white shadow-sm"
                : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<string>(pricingTabs[0].id);
  const plans = useMemo(() => getPricingPlans(activeTab), [activeTab]);
  const activeTabLabel = pricingTabs.find((tab) => tab.id === activeTab)?.label ?? "";

  return (
    <section id="pricing" className="bg-gray-50 py-[50px] md:py-[80px] lg:py-30">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-[30px] lg:gap-[42px]">

        <div className="text-center">
          <h2 className="font-display text-5xl md:text-6xl text-center text-gray-900 tracking-wide mb-4">
            SELECT PACKAGE
          </h2>
          <p className="text-center text-gray-500 text-sm max-w-md mx-auto mb-6">
            Premium quality with affordability & flexibility. Personalize your plan for custom solutions according to your business needs.
          </p>
          <TabSelector active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {plans.map((plan) =>
            plan.highlighted ? (
              <HighlightedCard key={plan.name} plan={plan} pagesLabel={activeTabLabel} />
            ) : (
              <RegularCard key={plan.name} plan={plan} pagesLabel={activeTabLabel} />
            )
          )}
        </div>

        {/* Custom plan banner */}
        <aside className="bg-primary rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl text-white tracking-wide mb-2">
              CUSTOM PRICING, TAILORED FOR YOU
            </h3>
            <p className="text-white/80 text-sm">
              Share your design vision, and we&apos;ll provide a quote that fits your needs and budget.
            </p>
          </div>
          <Link
            href={buildContactHref("Custom Package", null)}
            className="group inline-flex items-center gap-3 bg-surface-elevated text-primary text-[13px] font-bold tracking-[0.12em] uppercase pl-2 pr-6 py-2 rounded-full hover:bg-gray-100 transition-colors overflow-hidden whitespace-nowrap"
          >
            <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary shrink-0 overflow-hidden">
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
            Purchase Now
          </Link>
        </aside>

      </div>
    </section>
  );
}
