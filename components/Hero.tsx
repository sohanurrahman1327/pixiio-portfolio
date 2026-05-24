import Link from "next/link";
import HeroMarquee from "@/components/HeroMarquee";
import StartProjectButton from "@/components/StartProjectButton";

export default function Hero() {
  return (
    <section className="bg-gray-50 pt-8 pb-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[560px]">
          <HeroMarquee />

          <div className="flex flex-col justify-center py-8 lg:py-0">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-wide text-[#0f1a3d] mb-6">
              DESIGN-LED
              <br />
              CREATIVE
              <br />
              AGENCY
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md mb-8">
              Crafting high-impact UI, websites, and digital experiences for
              modern brands.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <StartProjectButton />
              <Link
                href="/work"
                className="inline-flex items-center text-xs font-semibold tracking-wider text-[#0f1a3d] bg-white border border-gray-200 px-6 py-3.5 rounded-full hover:border-gray-300 transition-colors"
              >
                VIEW WORK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
