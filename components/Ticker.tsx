const items = [
  "UI DESIGN",
  "LANDING PAGE DESIGN",
  "WEBSITE DESIGN",
  "BRANDING",
  "MARKETING",
];

export default function Ticker() {
  const repeated = [...items, ...items];

  return (
    <div
      className="bg-background overflow-hidden border-y border-border-subtle transition-colors duration-300"
      aria-hidden="true"
    >
      <div className="marquee-left flex whitespace-nowrap w-max items-stretch divide-x divide-border-subtle">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="group inline-flex items-center gap-6 px-8 py-6 text-navy text-xl font-bold tracking-[0.18em] transition-colors duration-300 hover:text-primary cursor-default"
          >
            <span className="text-border-subtle transition-colors duration-300 group-hover:text-primary">✦</span>
            {item}
            <span className="text-border-subtle transition-colors duration-300 group-hover:text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
