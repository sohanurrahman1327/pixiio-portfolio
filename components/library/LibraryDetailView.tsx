import Image from "next/image";
import Link from "next/link";
import type { LibraryItem } from "@/lib/library-types";
import { getCategoryLabel } from "@/lib/library-categories";
import { getPlatform, getPlatformLabel } from "@/lib/library-platforms";
import LibraryCard from "@/components/library/LibraryCard";

type Props = {
  item: LibraryItem;
  similar: LibraryItem[];
};

function FigmaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 24a4 4 0 004-4v-4H8v8z" fill="#0ACF83" />
      <path d="M4 12a4 4 0 014-4h4v8H8a4 4 0 01-4-4z" fill="#A259FF" />
      <path d="M4 4a4 4 0 014-4h4v8H8a4 4 0 01-4-4z" fill="#F24E1E" />
      <path d="M12 0h4a4 4 0 010 8h-4V0z" fill="#FF7262" />
      <path d="M20 12a4 4 0 11-8 0 4 4 0 018 0z" fill="#1ABCFE" />
    </svg>
  );
}

export default function LibraryDetailView({ item, similar }: Props) {
  const platform = getPlatform(item.platform);
  const categoryLabel = getCategoryLabel(item.category);

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/library/components" className="hover:text-primary transition-colors">
            Library
          </Link>
          <span>/</span>
          <span className="text-gray-500">{getPlatformLabel(item.platform)}</span>
          <span>/</span>
          <span className="text-gray-700">{item.title}</span>
        </nav>

        {/* Gallery */}
        <div className="space-y-4 mb-10">
          {item.galleryImages.map((src, i) => (
            <figure
              key={i}
              className="rounded-2xl overflow-hidden border border-gray-200 bg-surface-elevated shadow-sm"
            >
              <Image
                src={src}
                alt={`${item.title} - ${i + 1}`}
                width={1200}
                height={750}
                className="w-full h-auto object-cover"
                priority={i === 0}
              />
            </figure>
          ))}
        </div>

        {/* Title & meta */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href={`/library/templates?platform=${item.platform}`}
                className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
              >
                {getPlatformLabel(item.platform)}
              </Link>
              {item.isPro && (
                <span className="text-xs font-bold text-white bg-primary px-2 py-1 rounded-md">
                  Pro
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-4">
              {item.title}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {item.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {item.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/library/components?tag=${tag}`}
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <a
              href={item.figmaUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-navy-solid text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-primary transition-colors"
            >
              <FigmaIcon />
              {platform?.copyLabel ?? "Copy to Figma"}
            </a>
          </div>

          {/* Metadata sidebar */}
          <aside className="rounded-2xl border border-gray-200 bg-surface-elevated p-6 space-y-5 shadow-sm lg:sticky lg:top-28">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Category
              </p>
              <Link
                href={`/library/components?category=${item.category}`}
                className="text-sm font-medium text-gray-900 hover:text-primary transition-colors"
              >
                {categoryLabel}
              </Link>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Industry
              </p>
              <p className="text-sm text-gray-900">{item.industry}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Style
              </p>
              <p className="text-sm text-gray-900">{item.style}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Font Family
              </p>
              <p className="text-sm text-gray-900">{item.fontFamily}</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Contributor
              </p>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                  {item.contributor.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.contributor.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.contributor.role}</p>
                </div>
              </div>
              {item.contributor.url && (
                <Link
                  href={item.contributor.url}
                  className="inline-block mt-3 text-xs font-medium text-primary hover:underline"
                >
                  Visit
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Similar designs */}
      <section className="border-t border-gray-200 bg-background py-14">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-navy">Similar Designs</h2>
            <Link
              href="/library/components"
              className="text-sm font-medium text-primary hover:underline"
            >
              Explore All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((s) => (
              <LibraryCard key={s.slug} item={s} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
