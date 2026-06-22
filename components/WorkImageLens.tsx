"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const LENS_SIZE = 210;
const LENS_OFFSET = LENS_SIZE / 2;

const BLOB_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 210">
    <defs>
      <filter id="r" x="-35%" y="-35%" width="170%" height="170%">
        <feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="5" seed="6"/>
        <feDisplacementMap in="SourceGraphic" scale="34"/>
      </filter>
    </defs>
    <circle cx="105" cy="105" r="78" fill="white" filter="url(#r)"/>
  </svg>`
)}")`;

type WorkImageLensProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

function LensCrosshair() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
    >
      <line x1="18" y1="2" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="24" x2="18" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="18" x2="12" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="18" x2="34" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function WorkImageLens({
  src,
  alt,
  width = 900,
  height = 650,
  fill = false,
  sizes,
  className = "",
  priority,
}: WorkImageLensProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(finePointer.matches && !reducedMotion.matches);
    update();
    finePointer.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      finePointer.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const autoHeight = /\bh-auto\b/.test(className);

  const imageClass = autoHeight
    ? `w-full h-auto object-contain ${className}`
    : `object-cover ${fill ? "absolute inset-0 w-full h-full" : "w-full h-full"} ${className}`;
  const imageProps = fill
    ? { fill: true as const, sizes }
    : { width, height };

  if (!enabled) {
    return (
      <Image
        src={src}
        alt={alt}
        priority={priority}
        {...imageProps}
        className={`${imageClass}${autoHeight ? "" : " group-hover:scale-105 transition-transform duration-500"}`}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={`${fill ? "absolute inset-0" : autoHeight ? "relative w-full" : "relative w-full h-full"} overflow-hidden transition-transform duration-500 ${
        hovering && !autoHeight ? "scale-105 cursor-none" : "scale-100"
      }`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={onMove}
    >
      <Image
        src={src}
        alt={alt}
        priority={priority}
        {...imageProps}
        className={imageClass}
      />

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: hovering ? 1 : 0,
          WebkitMaskImage: BLOB_MASK,
          maskImage: BLOB_MASK,
          WebkitMaskSize: `${LENS_SIZE}px ${LENS_SIZE}px`,
          maskSize: `${LENS_SIZE}px ${LENS_SIZE}px`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: `${pos.x - LENS_OFFSET}px ${pos.y - LENS_OFFSET}px`,
          maskPosition: `${pos.x - LENS_OFFSET}px ${pos.y - LENS_OFFSET}px`,
        }}
      >
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          {...imageProps}
          className={`${imageClass} invert`}
        />
      </div>

      {hovering && (
        <div
          className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: pos.x, top: pos.y }}
        >
          <LensCrosshair />
        </div>
      )}
    </div>
  );
}
