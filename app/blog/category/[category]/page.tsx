import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import BlogCard from "@/components/BlogCard";
import { getPostsByCategory } from "@/lib/blog";
import { blogCategories } from "@/lib/blog-categories";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import type { BlogCategorySlug } from "@/lib/blog-types";

type Props = {
  params: Promise<{ category: string }>;
};

function getCategory(slug: string) {
  return blogCategories.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    return { title: "Category Not Found — Pixiio Blog" };
  }

  const hasPosts = getPostsByCategory(category.slug).length > 0;

  return {
    title: `${category.label} Articles`,
    description: category.description,
    keywords: category.keywords,
    alternates: { canonical: `/blog/category/${category.slug}` },
    // Thin/empty category pages shouldn't be indexed until they have content.
    robots: hasPosts ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${category.label} Articles — Pixiio Blog`,
      description: category.description,
      url: `/blog/category/${category.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return blogCategories.map((category) => ({ category: category.slug }));
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(categorySlug as BlogCategorySlug);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: category.label, path: `/blog/category/${category.slug}` },
          ])
        )}
      />
      <PageHero
        label="BLOG CATEGORY"
        title={category.label.toUpperCase()}
        description={category.description}
      />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {/* Category switcher */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/blog"
              className="text-sm font-medium px-4 py-2 rounded-full border bg-surface-elevated text-gray-600 border-gray-200 hover:border-primary hover:text-primary transition-colors"
            >
              All
            </Link>
            {blogCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
                  cat.slug === category.slug
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-elevated text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm mb-6">
                No articles published in this category yet — check back soon.
              </p>
              <Link
                href="/blog"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Browse all articles →
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-8">
                {posts.length} article{posts.length !== 1 ? "s" : ""}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
                {posts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
