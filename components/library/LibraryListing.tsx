"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { LibraryType } from "@/lib/library-types";
import { filterItems } from "@/lib/library";
import type { LibraryCategory } from "@/lib/library-types";
import type { PlatformSlug } from "@/lib/library-types";
import { libraryCategories } from "@/lib/library-categories";
import { libraryPlatforms } from "@/lib/library-platforms";
import LibraryCard from "@/components/library/LibraryCard";
import LibrarySidebar from "@/components/library/LibrarySidebar";
import LibraryHero from "@/components/library/LibraryHero";
import LibrarySearch from "@/components/library/LibrarySearch";

type Props = {
  type: LibraryType;
  basePath: string;
};

function isPlatform(v: string | null): v is PlatformSlug {
  return libraryPlatforms.some((p) => p.slug === v);
}

function isCategory(v: string | null): v is LibraryCategory {
  return libraryCategories.some((c) => c.slug === v);
}

function LibraryListingInner({ type, basePath }: Props) {
  const searchParams = useSearchParams();
  const platformParam = searchParams.get("platform");
  const categoryParam = searchParams.get("category");
  const tagParam = searchParams.get("tag");
  const query = searchParams.get("q") ?? "";

  const items = filterItems({
    type,
    platform: isPlatform(platformParam) ? platformParam : undefined,
    category: isCategory(categoryParam) ? categoryParam : undefined,
    tag: tagParam ?? undefined,
    query: query || undefined,
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
      <LibrarySearch basePath={basePath} />

      <LibraryHero />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mt-8">
        <Suspense fallback={<div className="w-[240px] shrink-0" />}>
          <LibrarySidebar basePath={basePath} />
        </Suspense>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400 mb-6">
            {items.length} result{items.length !== 1 ? "s" : ""}
          </p>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-sm">No items match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <LibraryCard key={item.slug} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LibraryListing(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1600px] mx-auto px-6 py-20 text-center text-gray-400 text-sm">
          Loading library…
        </div>
      }
    >
      <LibraryListingInner {...props} />
    </Suspense>
  );
}
