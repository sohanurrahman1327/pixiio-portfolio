"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { BlogCategorySlug } from "@/lib/blog-types";
import { blogCategories } from "@/lib/blog-categories";
import { blogPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

const PAGE_SIZE = 8;

const categorySlugs = blogCategories.map((c) => c.slug);

function isCategorySlug(value: string | null): value is BlogCategorySlug {
  return categorySlugs.includes(value as BlogCategorySlug);
}

export default function BlogListing() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const activeCategory = isCategorySlug(categoryParam) ? categoryParam : null;

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  const filtered = useMemo(() => {
    const sorted = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    if (!activeCategory) return sorted;
    return sorted.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    const prevCount = visibleCount;
    setVisibleCount((c) => c + PAGE_SIZE);
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("lenis:resize"));
      setTimeout(() => {
        const lenis = (window as Window & { __lenis?: { resize: () => void; scrollTo: (target: HTMLElement, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
        lenis?.resize();
        const target = document.querySelector(
          `[data-blog-card="${prevCount}"]`
        ) as HTMLElement | null;
        if (target && lenis) {
          lenis.scrollTo(target, { offset: -100, duration: 1.1 });
        } else {
          target?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 120);
    });
  };

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <a
          href="/blog"
          className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
            !activeCategory
              ? "bg-primary text-white border-primary"
              : "bg-surface-elevated text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
          }`}
        >
          All
        </a>
        {blogCategories.map((cat) => (
          <a
            key={cat.slug}
            href={`/blog?category=${cat.slug}`}
            className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
              activeCategory === cat.slug
                ? "bg-primary text-white border-primary"
                : "bg-surface-elevated text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      <p className="text-sm text-gray-400 mb-8">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
        {visible.map((post, index) => (
          <BlogCard key={post.slug} post={post} index={index} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
          >
            Load More Articles
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Showing {visible.length} of {filtered.length} articles
          </p>
        </div>
      )}
    </>
  );
}
