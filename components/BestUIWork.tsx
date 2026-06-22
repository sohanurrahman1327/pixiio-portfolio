import Image from "next/image";
import { bestUIWorkRow1, bestUIWorkRow2 } from "@/lib/images";

type MarqueeItem = {
  src: string;
  alt: string;
  w: number;
};

function HorizontalMarquee({
  items,
  direction,
  speed = "40s",
}: {
  items: MarqueeItem[];
  direction: "left" | "right";
  speed?: string;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-x-clip">
      <div
        className={`flex gap-4 w-max ${
          direction === "left" ? "marquee-left" : "marquee-right"
        }`}
        style={{ animationDuration: speed }}
      >
        {doubled.map((item, i) => (
          <figure
            key={`${item.alt}-${i}`}
            className="relative shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-surface-elevated"
            style={{ width: item.w }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={520}
              height={320}
              className="object-cover w-full h-[220px] md:h-[260px]"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function BestUIWork() {
  return (
    <section className="bg-background py-[50px] md:py-[80px] lg:py-30 overflow-x-clip flex flex-col gap-[30px] lg:gap-[42px]">
      <div className="text-center px-6">
        <p className="text-[11px] font-bold tracking-[0.25em] text-primary mb-3">
          BEST WORK
        </p>
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-navy tracking-wide">
          BEST UI WORK
        </h2>
      </div>

      <div className="space-y-4">
        <HorizontalMarquee items={bestUIWorkRow1} direction="left" speed="45s" />
        <HorizontalMarquee items={bestUIWorkRow2} direction="right" speed="50s" />
      </div>
    </section>
  );
}
