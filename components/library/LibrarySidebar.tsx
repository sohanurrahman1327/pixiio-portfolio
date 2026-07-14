import Link from "next/link";
import { libraryCategories, libraryTags } from "@/lib/library-categories";
import { libraryPlatforms } from "@/lib/library-platforms";

type Props = {
  basePath: string;
  activePlatform?: string;
  activeCategory?: string;
  activeTag?: string;
  activeQuery?: string;
};

function buildHref(
  basePath: string,
  current: Record<string, string | undefined>,
  key: string,
  value: string | null
) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (v && k !== key) next.set(k, v);
  }
  if (value !== null) next.set(key, value);
  const qs = next.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function LibrarySidebar({
  basePath,
  activePlatform,
  activeCategory,
  activeTag,
  activeQuery,
}: Props) {
  const current = {
    platform: activePlatform,
    category: activeCategory,
    tag: activeTag,
    q: activeQuery,
  };

  const pillClass = (active: boolean) =>
    `inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
      active
        ? "bg-navy-solid text-white border-navy-solid"
        : "bg-surface-elevated text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
    }`;

  return (
    <aside className="w-full lg:w-[240px] shrink-0 space-y-8">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Platform
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href={buildHref(basePath, current, "platform", null)}
              className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors ${
                !activePlatform
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Platforms
            </Link>
          </li>
          {libraryPlatforms.map((p) => (
            <li key={p.slug}>
              <Link
                href={buildHref(basePath, current, "platform", p.slug)}
                className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors ${
                  activePlatform === p.slug
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="w-6 h-6 rounded-md bg-gray-100 text-[10px] font-bold flex items-center justify-center text-gray-500 shrink-0">
                  {p.icon}
                </span>
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Categories
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={buildHref(basePath, current, "category", null)}
            className={pillClass(!activeCategory)}
          >
            All
          </Link>
          {libraryCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={buildHref(basePath, current, "category", cat.slug)}
              className={pillClass(activeCategory === cat.slug)}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Tags
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={buildHref(basePath, current, "tag", null)}
            className={pillClass(!activeTag)}
          >
            All
          </Link>
          {libraryTags.map((tag) => (
            <Link
              key={tag}
              href={buildHref(basePath, current, "tag", tag.toLowerCase())}
              className={pillClass(activeTag === tag.toLowerCase())}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {(activePlatform || activeCategory || activeTag || activeQuery) && (
        <Link href={basePath} className="text-xs text-primary font-medium hover:underline">
          Clear all filters
        </Link>
      )}
    </aside>
  );
}
