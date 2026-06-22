import Link from "next/link";

type PageHeroProps = {
  label?: string;
  title: string;
  description: string;
};

export default function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <section className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 transition-colors mb-8"
        >
          ← Back to Home
        </Link>
        {label && (
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary mb-3">
            {label}
          </p>
        )}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-navy tracking-wide leading-none mb-5">
          {title}
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
