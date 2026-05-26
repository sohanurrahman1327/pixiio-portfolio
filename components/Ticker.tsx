const items = [
  "UI DESIGN",
  "LANDING PAGE DESIGN",
  "WEBSITE DESIGN",
  "BRANDING",
  "MARKETING",
];

export default function Ticker() {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-primary overflow-hidden py-6">
      <div className="ticker-track flex whitespace-nowrap w-max">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-white text-2xl font-bold tracking-[0.18em]"
          >
            {/* Left gap before text */}
            <span className="w-12 inline-block" />
            {item}
            {/* Right gap + icon — same width as left gap so spacing is symmetric */}
            <span className="w-12 inline-flex items-center justify-center text-white/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
