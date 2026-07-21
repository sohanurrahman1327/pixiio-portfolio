import { bonuses } from "@/lib/content";

/* ─── Bonus card icons ─── */
const bonusIcons: Record<string, React.ReactNode> = {
  prototype: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="6" y1="4" x2="6" y2="20" />
      <circle cx="6" cy="9" r="2.25" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <circle cx="12" cy="15" r="2.25" />
      <line x1="18" y1="4" x2="18" y2="20" />
      <circle cx="18" cy="7" r="2.25" />
    </svg>
  ),
  handoff: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m8 9.5-3 2.5 3 2.5" />
      <path d="m16 9.5 3 2.5-3 2.5" />
    </svg>
  ),
  management: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v4M12 11 6.8 17M12 11l5.2 6" />
    </svg>
  ),
  consultation: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 8.5h9a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1l-3 3v-3h-5a2 2 0 0 1-2-2v-1.5" />
      <path d="M4 3.5h9a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-3 3v-3H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
    </svg>
  ),
};

export default function Bonuses() {
  return (
    <section className="bg-gray-50 py-[50px] md:py-[80px] lg:py-30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-navy-solid border border-primary/25 p-8 md:p-12">
          {/* Aurora glow blobs — top-right */}
          <div
            className="absolute -top-24 -right-16 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(91,95,239,0.5) 0%, rgba(91,95,239,0.14) 45%, transparent 72%)" }}
          />
          <div
            className="absolute -top-10 right-24 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(165,180,252,0.4) 0%, transparent 70%)", filter: "blur(18px)" }}
          />

          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-5xl tracking-wide leading-[1.05] mb-8 md:mb-10">
              <span className="text-white/85">Bonuses Worth Over</span>
              <br />
              <span className="text-[#a5b4fc]">$2,500</span>
              <span className="text-white">, Yours Free!</span>
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bonuses.map((bonus) => (
                <div
                  key={bonus.title}
                  className="rounded-2xl border border-primary/25 hover:border-primary/50 p-5 md:p-6 transition-colors duration-300"
                >
                  <span className="block text-white/90 mb-4">
                    {bonusIcons[bonus.icon]}
                  </span>
                  <h3 className="font-bold text-white text-[15px] mb-1.5">
                    {bonus.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {bonus.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
