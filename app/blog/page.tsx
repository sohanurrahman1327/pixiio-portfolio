import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import BlogListing from "@/components/BlogListing";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog, Design Insights & Guides",
  description:
    "Expert articles on website redesign, SaaS design, WordPress, UI/UX, and industry-specific web design, written by the Pixiio team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <PageShell>
      <PageHero
        label="BLOG"
        title="DESIGN INSIGHTS & GUIDES"
        description="Expert articles on website redesign, SaaS design, WordPress, UI/UX, and industry-specific web design, written by the Pixiio team."
      />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <Suspense
            fallback={
              <div className="grid sm:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[16/10] bg-gray-100 rounded-2xl mb-5" />
                    <div className="h-4 bg-gray-100 rounded w-1/4 mb-3" />
                    <div className="h-8 bg-gray-100 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                  </div>
                ))}
              </div>
            }
          >
            <BlogListing />
          </Suspense>
        </div>
      </section>

      <section className="relative bg-navy-solid py-14 md:py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(91,95,239,0.35) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="text-left max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary mb-3 uppercase">
              Pixiio Blog
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-3">
              {blogPosts.length} ARTICLES & GROWING
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              From website redesign strategy to SaaS conversion and Elementor
              expertise, practical guides for ambitious brands.
            </p>
          </div>
          <div className="shrink-0 md:self-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-3 bg-primary text-white text-[13px] font-bold tracking-[0.12em] uppercase pl-6 pr-2 py-2 rounded-full hover:bg-primary-dark transition-colors overflow-hidden group"
            >
              View Pricing
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 12L12 4M12 4H6M12 4V10"
                    stroke="#5b5fef"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
