"use client";

import Image from "next/image";
import Link from "next/link";
import type { LibraryItem } from "@/lib/library-types";
import { getItemDetailPath } from "@/lib/library";
import { getPlatform } from "@/lib/library-platforms";
import { getCategoryLabel } from "@/lib/library-categories";
import { formatLibraryDate } from "@/lib/library";

type Props = {
  item: LibraryItem;
};

function FigmaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 24a4 4 0 004-4v-4H8v8z" fill="#0ACF83" />
      <path d="M4 12a4 4 0 014-4h4v8H8a4 4 0 01-4-4z" fill="#A259FF" />
      <path d="M4 4a4 4 0 014-4h4v8H8a4 4 0 01-4-4z" fill="#F24E1E" />
      <path d="M12 0h4a4 4 0 010 8h-4V0z" fill="#FF7262" />
      <path d="M20 12a4 4 0 11-8 0 4 4 0 018 0z" fill="#1ABCFE" />
    </svg>
  );
}

export default function LibraryCard({ item }: Props) {
  const platform = getPlatform(item.platform);
  const detailPath = getItemDetailPath(item.slug);

  return (
    <article className="group">
      <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3] mb-3">
        <Image
          src={item.previewImage}
          alt={item.title}
          width={480}
          height={360}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/20 backdrop-blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={item.figmaUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2.5 bg-surface-elevated text-gray-900 text-sm font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <FigmaIcon />
            {platform?.copyLabel ?? "Copy to Figma"}
          </a>
          <Link
            href={detailPath}
            className="inline-flex items-center bg-surface-elevated text-gray-900 text-sm font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            Preview Design
          </Link>
        </div>

        {item.isPro && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
            Pro
          </span>
        )}
      </div>

      <Link href={detailPath} className="block">
        <div className="flex items-start gap-2">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors leading-snug">
            {item.title}
          </h3>
          {item.isPro && (
            <span className="shrink-0 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              Pro
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Added {formatLibraryDate(item.publishedAt)} in {getCategoryLabel(item.category)}
        </p>
      </Link>
    </article>
  );
}
