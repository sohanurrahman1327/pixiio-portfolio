import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogArticleBody from "@/components/BlogArticleBody";
import BlogCard from "@/components/BlogCard";
import BlogTableOfContents from "@/components/BlogTableOfContents";
import StartProjectButton from "@/components/StartProjectButton";
import {
  blogPosts,
  formatBlogDate,
  getPostBySlug,
  getRelatedPosts,
  getTocFromSections,
} from "@/lib/blog";
import { blogCategories, getCategoryLabel } from "@/lib/blog-categories";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found — Pixiio Blog",
      description: "The article you're looking for doesn't exist.",
    };
  }

  return {
    title: `${post.title} | Pixiio Blog`,
    description: post.excerpt,
    keywords: post.tags,
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <PageShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="font-display text-4xl text-gray-900 mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-500 mb-8">
              The article you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Back to Blog <span>→</span>
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const related = getRelatedPosts(post);
  const toc = getTocFromSections(post.sections);
  const categoryLabel = getCategoryLabel(post.category);

  return (
    <PageShell>
      <article className="bg-background">
        {/* Header — Element Pack style */}
        <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-14 pb-8">
          <nav
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-400 mb-8"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href={`/blog?category=${post.category}`}
              className="hover:text-primary transition-colors"
            >
              {categoryLabel}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 line-clamp-1">{post.title}</span>
          </nav>

          <h1 className="text-3xl md:text-[2.5rem] lg:text-[2.75rem] font-bold text-navy leading-[1.15] tracking-tight mb-6 max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-5">
            <span className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shrink-0">
              {post.author.name.charAt(0)}
            </span>
            <span className="font-medium text-gray-700">{post.author.name}</span>
            <span className="text-gray-300">·</span>
            <Link
              href={`/blog?category=${post.category}`}
              className="hover:text-primary transition-colors"
            >
              {categoryLabel}
            </Link>
            <span className="text-gray-300">·</span>
            <time dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt)}
            </time>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content + sidebar */}
        <div className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-10 xl:gap-14 items-start">
            <div className="min-w-0">
              <BlogArticleBody sections={post.sections} />

              {/* Author bio */}
              <div className="mt-14 pt-8 border-t border-gray-100 flex gap-4">
                <span className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center text-lg shrink-0">
                  {post.author.name.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-navy">{post.author.name}</p>
                  <p className="text-sm text-gray-500 mb-2">{post.author.role}</p>
                  <p className="text-[15px] text-gray-600 leading-relaxed">
                    Pixiio designs and builds high-converting websites for
                    startups, SaaS companies, and local businesses worldwide.
                  </p>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 space-y-6">
              <BlogTableOfContents items={toc} />

              <div className="rounded-xl border border-gray-200 bg-surface-elevated p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-navy mb-4 pb-3 border-b border-gray-100">
                  Categories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/blog"
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      All Articles
                    </Link>
                  </li>
                  {blogCategories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/blog?category=${cat.slug}`}
                        className={`text-sm transition-colors ${
                          post.category === cat.slug
                            ? "text-primary font-semibold"
                            : "text-gray-600 hover:text-primary"
                        }`}
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-navy-solid p-6 shadow-sm">
                <p className="text-base font-bold text-white mb-1.5">
                  Pixiio Design Agency
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-5">
                  We design conversion-ready websites for ambitious brands —
                  WordPress, Elementor, SaaS & more.
                </p>
                <StartProjectButton />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Related articles */}
      <section className="py-14 md:py-18 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-bold text-navy mb-8">
            Related Articles
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((relatedPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
