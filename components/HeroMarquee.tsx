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
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Top fade — acts as the top gap */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-surface-muted to-transparent z-10 pointer-events-none" />
      {/* Bottom fade — acts as the bottom gap */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-muted to-transparent z-10 pointer-events-none" />

      {/* Two scrolling columns */}
      <div className="grid grid-cols-2 gap-4 h-full">
        <LeftColumn />
        <RightColumn />
      </div>

      {/* Pixiio logo — centered, white 4px border */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="w-24 h-24 rounded-full bg-primary border-4 border-white flex items-center justify-center shadow-xl shadow-primary/40">
          {/* Inline icon path only — no background rect, so white fills correctly */}
          <svg
            width="48"
            height="48"
            viewBox="30.5 24.8 39 50.4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Pixiio"
          >
            <path
              d="M67.9385 55.7363C68.5411 55.1955 69.4997 55.6229 69.5 56.4326V68.3936C69.5 72.129 66.4718 75.1572 62.7363 75.1572C62.5496 75.1572 62.3984 75.0061 62.3984 74.8193V61.1592C62.3984 60.8754 62.5185 60.6047 62.7295 60.415L67.9385 55.7363ZM59.0947 24.8428C59.3599 24.8428 59.6142 24.9483 59.8018 25.1357L69.207 34.541C69.3945 34.7285 69.5 34.9829 69.5 35.248V47.7559C69.5 48.0355 69.3825 48.3028 69.1768 48.4922L59.7871 57.1338C59.6079 57.2987 59.3744 57.3933 59.1309 57.3984L51.3818 57.5615C50.8217 57.5731 50.3615 57.1228 50.3613 56.5625V49.1943C50.3615 48.6422 50.8091 48.1943 51.3613 48.1943H55.3984C55.713 48.1942 56.0094 48.0466 56.1982 47.7949L59.3096 43.6465C59.4392 43.4735 59.5087 43.263 59.5088 43.0469V39.4609C59.5088 39.1959 59.4041 38.9414 59.2168 38.7539L56.1914 35.7285C56.004 35.5411 55.7494 35.4357 55.4844 35.4355H42.5742C42.0219 35.4355 41.5742 35.8833 41.5742 36.4355V51.6855L49.707 59.8184C49.8945 60.0059 50 60.2602 50 60.5254V72.7432C50 73.6341 48.9229 74.0802 48.293 73.4502L41.7471 66.9043C41.5596 66.7168 41.4542 66.4624 41.4541 66.1973V51.5654L30.793 40.9043C30.6055 40.7168 30.5 40.4624 30.5 40.1973V25.8428C30.5 25.2905 30.9477 24.8428 31.5 24.8428H59.0947Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
