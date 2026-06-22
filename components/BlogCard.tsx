import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-types";
import { formatBlogDate } from "@/lib/blog";
import { getCategoryLabel } from "@/lib/blog-categories";

type Props = {
  post: BlogPost;
  index?: number;
};

export default function BlogCard({ post, index }: Props) {
  return (
    <article className="group" data-blog-card={index}>
      <Link href={`/blog/${post.slug}`} className="block">
        <figure className="rounded-2xl overflow-hidden aspect-[16/10] border border-gray-100 bg-gray-50 mb-5">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={640}
            height={400}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </figure>

        <div className="space-y-3">
          <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
            {getCategoryLabel(post.category)}
          </span>

          <h2 className="font-display text-2xl md:text-[1.65rem] tracking-wide text-navy leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1 text-xs text-gray-400">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
              {post.author.name.charAt(0)}
            </span>
            <span className="text-gray-600 font-medium">{post.author.name}</span>
            <span>·</span>
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
          </div>
        </div>
      </Link>
    </article>
  );
}
