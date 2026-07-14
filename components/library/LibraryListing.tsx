import type { LibraryCategory, LibraryType, PlatformSlug } from "@/lib/library-types";
import { filterItems } from "@/lib/library";
import { libraryCategories } from "@/lib/library-categories";
import { libraryPlatforms } from "@/lib/library-platforms";
import LibraryCard from "@/components/library/LibraryCard";
import LibrarySidebar from "@/components/library/LibrarySidebar";
import LibraryHero from "@/components/library/LibraryHero";
import LibrarySearch from "@/components/library/LibrarySearch";

type Props = {
  type: LibraryType;
  basePath: string;
  heroTitle: string;
  platform?: string;
  category?: string;
  tag?: string;
  query?: string;
};

function isPlatform(v: string | undefined): v is PlatformSlug {
  return !!v && libraryPlatforms.some((p) => p.slug === v);
}

function isCategory(v: string | undefined): v is LibraryCategory {
  return !!v && libraryCategories.some((c) => c.slug === v);
}

/**
 * Rendered server-side (no `useSearchParams`) so search engines and other
 * non-JS crawlers receive the fully filtered listing in the initial HTML
 * instead of a client-only "Loading library…" placeholder.
 */
export default function LibraryListing({
  type,
  basePath,
  heroTitle,
  platform,
  category,
  tag,
  query,
}: Props) {
  const activePlatform = isPlatform(platform) ? platform : undefined;
  const activeCategory = isCategory(category) ? category : undefined;

  const items = filterItems({
    type,
    platform: activePlatform,
    category: activeCategory,
    tag: tag || undefined,
    query: query || undefined,
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
      <LibrarySearch
        basePath={basePath}
        initialQuery={query ?? ""}
        currentParams={{ platform: activePlatform, category: activeCategory, tag, q: query }}
      />

      <LibraryHero title={heroTitle} />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mt-8">
        <LibrarySidebar
          basePath={basePath}
          activePlatform={activePlatform}
          activeCategory={activeCategory}
          activeTag={tag}
          activeQuery={query}
        />

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
