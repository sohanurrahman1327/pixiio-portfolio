import Link from "next/link";

type LibraryHeroProps = {
  title?: string;
};

export default function LibraryHero({
  title = "Website components for WordPress, Figma, Elementor & more",
}: LibraryHeroProps) {
  return (
    <div className="relative mt-6 rounded-2xl overflow-hidden bg-gradient-to-br from-surface-muted via-[#e8eaff] to-[#dde1ff] border border-border-subtle">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
        <div className="max-w-lg">
          <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-3 bg-surface-elevated/60 px-3 py-1 rounded-full">
            Build Better, Faster
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-navy leading-tight mb-3">
            {title}
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Browse hundreds of ready-made components, blocks, and templates,
            crafted for modern brands and built to ship fast.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-navy-solid text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary transition-colors"
            >
              Unlock all access
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Decorative preview stack */}
        <div className="hidden md:block relative w-[280px] h-[180px] shrink-0">
          <div className="absolute top-0 right-0 w-[200px] h-[130px] rounded-xl bg-surface-elevated shadow-lg border border-gray-100 rotate-3 overflow-hidden">
            <div className="h-8 bg-gray-50 border-b border-gray-100" />
            <div className="p-3 space-y-2">
              <div className="h-2 bg-gray-100 rounded w-3/4" />
              <div className="h-2 bg-primary/20 rounded w-1/2" />
              <div className="h-16 bg-gray-50 rounded mt-2" />
            </div>
          </div>
          <div className="absolute top-4 right-8 w-[200px] h-[130px] rounded-xl bg-surface-elevated shadow-md border border-gray-100 -rotate-2 overflow-hidden">
            <div className="h-8 bg-primary/10 border-b border-gray-100" />
            <div className="p-3 space-y-2">
              <div className="h-2 bg-gray-100 rounded w-full" />
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <div className="h-10 bg-gray-50 rounded" />
                <div className="h-10 bg-primary/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
