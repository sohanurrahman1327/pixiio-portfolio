import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogArticleBody from "@/components/BlogArticleBody";
import BlogTableOfContents from "@/components/BlogTableOfContents";
import StartProjectButton from "@/components/StartProjectButton";
import {
  blogPosts,
  formatBlogDate,
  formatBlogDateShort,
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

  const related = getRelatedPosts(post, 4);
  const toc = getTocFromSections(post.sections);
  const categoryLabel = getCategoryLabel(post.category);

  return (
    <PageShell>
      {/* Header — Element Pack style */}
      <section className="bg-gradient-to-b from-surface-muted to-background pt-12 pb-0 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[60px]">
          <nav
            className="flex items-center gap-2 text-[12px] text-gray-400 mb-6 flex-wrap"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/blog?category=${post.category}`}
              className="hover:text-primary transition-colors"
            >
              {categoryLabel}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-navy line-clamp-1">{post.title}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-navy leading-tight max-w-4xl mb-5">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 pb-8 text-[13px] text-gray-400 flex-wrap">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shrink-0 text-white text-[13px] font-bold">
              {post.author.name.charAt(0)}
            </div>
            <span className="font-medium text-[#3c4d6b] dark:text-gray-600">
              {post.author.name}
            </span>
            <span aria-hidden="true">·</span>
            <Link
              href={`/blog?category=${post.category}`}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase tracking-wide"
            >
              {categoryLabel}
            </Link>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt)}
            </time>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[60px]">
        <div className="blog-layout pt-12 pb-20">
          <BlogTableOfContents items={toc} />

          <article className="blog-article min-w-0" aria-label={post.title}>
            {post.tags.length > 0 && (
              <div className="pt-0 pb-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-gray-50 text-[#3c4d6b] dark:text-gray-600 border border-gray-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!post.sections.some((s) => s.type === "image") && (
              <figure className="mb-6">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={1200}
                  height={675}
                  priority
                  className="w-full h-auto object-cover rounded-2xl border border-gray-100"
                />
              </figure>
            )}

            <BlogArticleBody sections={post.sections} />

            {/* Author bio */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
              <span className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-bold flex items-center justify-center text-lg shrink-0">
                {post.author.name.charAt(0)}
              </span>
              <div>
                <p className="font-semibold text-navy">{post.author.name}</p>
                <p className="text-sm text-gray-400 mb-2">{post.author.role}</p>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Pixiio designs and builds high-converting websites for
                  startups, SaaS companies, and local businesses worldwide.
                </p>
              </div>
            </div>
          </article>

          <aside className="blog-sidebar">
            <div className="lg:sticky lg:top-24">
              <div className="flex flex-col gap-6" aria-label="Sidebar">
                {/* Related Articles */}
                {related.length > 0 && (
                <div className="bg-surface-elevated rounded-2xl border border-gray-100 p-5">
                  <h2 className="text-[13px] font-bold text-navy uppercase tracking-wider mb-4">
                    Related Articles
                  </h2>
                  <ul className="flex flex-col gap-4" role="list">
                    {related.map((relatedPost) => (
                      <li key={relatedPost.slug}>
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="group flex flex-col gap-1.5"
                        >
                          <div className="rounded-xl overflow-hidden aspect-[16/9] bg-surface-muted shrink-0">
                            <Image
                              src={relatedPost.coverImage}
                              alt={relatedPost.title}
                              width={400}
                              height={225}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                            />
                          </div>
                          <span className="text-[12.5px] font-semibold text-navy leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </span>
                          <time
                            dateTime={relatedPost.publishedAt}
                            className="text-[11px] text-gray-400"
                          >
                            {formatBlogDateShort(relatedPost.publishedAt)}
                          </time>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                )}

                {/* Categories */}
                <div className="bg-surface-elevated rounded-2xl border border-gray-100 p-5">
                  <h2 className="text-[13px] font-bold text-navy uppercase tracking-wider mb-4">
                    Categories
                  </h2>
                  <ul className="flex flex-col gap-1" role="list">
                    <li>
                      <Link
                        href="/blog"
                        className="flex items-center px-3 py-2 rounded-xl text-[13px] transition-colors text-[#3c4d6b] dark:text-gray-600 hover:bg-surface-muted"
                      >
                        All Articles
                      </Link>
                    </li>
                    {blogCategories.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/blog?category=${cat.slug}`}
                          className={`flex items-center px-3 py-2 rounded-xl text-[13px] transition-colors ${
                            post.category === cat.slug
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-[#3c4d6b] dark:text-gray-600 hover:bg-surface-muted"
                          }`}
                        >
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-navy-solid via-[#152240] to-navy-solid p-5 flex flex-col gap-3 relative">
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 65% 35%, var(--primary) 0%, transparent 65%)",
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex flex-col gap-2">
                    <p className="text-white text-[15px] font-bold leading-snug">
                      Pixiio Design Agency
                    </p>
                    <p className="text-gray-400 text-[12px] leading-relaxed">
                      We design conversion-ready websites for ambitious brands —
                      WordPress, Elementor, SaaS & more.
                    </p>
                  </div>
                  <div className="relative z-10">
                    <StartProjectButton className="w-full justify-center" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
