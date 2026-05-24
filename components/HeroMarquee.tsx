import Image from "next/image";
import { heroMarqueeImages } from "@/lib/images";

function MarqueeColumn({
  items,
  direction,
}: {
  items: typeof heroMarqueeImages.left;
  direction: "up" | "down";
}) {
  const doubled = [...items, ...items];

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`flex flex-col gap-4 ${
          direction === "up" ? "marquee-up" : "marquee-down"
        }`}
      >
        {doubled.map((item, i) => (
          <figure
            key={`${item.title}-${i}`}
            className="relative rounded-2xl overflow-hidden shrink-0 shadow-md border border-gray-100 bg-white"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={640}
              height={480}
              className="object-cover w-full h-48"
              priority={i < 2}
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-3">
              <span className="text-white text-[10px] font-semibold tracking-widest uppercase">
                {item.title}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function HeroMarquee() {
  return (
    <div className="relative h-[580px] overflow-hidden hidden lg:grid grid-cols-2 gap-4">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />

      <MarqueeColumn items={heroMarqueeImages.left} direction="up" />
      <MarqueeColumn items={heroMarqueeImages.right} direction="down" />
    </div>
  );
}
