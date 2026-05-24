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
    <div className="bg-primary overflow-hidden py-3.5">
      <div className="ticker-track flex whitespace-nowrap w-max">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-white text-xs font-semibold tracking-[0.2em] mx-6"
          >
            {item}
            <span className="ml-6 text-white/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
