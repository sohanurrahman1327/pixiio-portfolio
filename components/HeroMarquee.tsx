"use client";

import Image from "next/image";
import { heroMarqueeImages } from "@/lib/images";

function LeftColumn() {
  const items = [...heroMarqueeImages.left, ...heroMarqueeImages.left];
  return (
    <div className="relative h-full overflow-hidden">
      <div className="flex flex-col gap-4 marquee-up">
        {items.map((item, i) => (
          <div key={i} className="shrink-0 overflow-hidden">
            <Image
              src={item.src}
              alt={item.alt}
              width={320}
              height={220}
              className="object-cover w-full h-[200px]"
              priority={i < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function RightColumn() {
  const items = [...heroMarqueeImages.right, ...heroMarqueeImages.right];
  return (
    <div className="relative h-full overflow-hidden">
      <div className="flex flex-col gap-4 marquee-down">
        {items.map((item, i) => (
          <div key={i} className="shrink-0 overflow-hidden group/img">
            <Image
              src={item.src}
              alt={item.alt}
              width={320}
              height={220}
              className="object-cover w-full h-[200px] transition-all duration-500 group-hover/img:scale-105 group-hover/img:opacity-85"
              priority={i < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroMarquee() {
  return (
    /* absolute inset-0 — fills the relative parent in Hero exactly */
    <div className="absolute inset-0 overflow-hidden">
      {/* Top fade — acts as the top gap */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#eef0fb] to-transparent z-10 pointer-events-none" />
      {/* Bottom fade — acts as the bottom gap */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#eef0fb] to-transparent z-10 pointer-events-none" />

      {/* Two scrolling columns */}
      <div className="grid grid-cols-2 gap-4 h-full">
        <LeftColumn />
        <RightColumn />
      </div>

      {/* Pixiio logo — centered, white 4px border */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="w-24 h-24 rounded-full bg-primary border-4 border-white flex items-center justify-center shadow-xl shadow-primary/40">
          <Image
            src="/pixiio-logo.png"
            alt="Pixiio"
            width={56}
            height={56}
            className="w-12 h-12 object-contain brightness-0 invert"
          />
        </div>
      </div>
    </div>
  );
}
