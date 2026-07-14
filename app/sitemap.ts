import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { services } from "@/lib/content";
import { blogPosts, getPostsByCategory } from "@/lib/blog";
import { blogCategories } from "@/lib/blog-categories";
import { featuredWorkImages } from "@/lib/images";
import { libraryItems } from "@/lib/library";

const SITE_URL = getSiteUrl();

function url(path: string) {
  return `${SITE_URL}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/work"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/blog"), changeFrequency: "daily", priority: 0.8 },
    { url: url("/library/components"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/library/blocks"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/library/templates"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/process"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/why-us"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/pricing"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/faq"), changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: url(`/services/${service.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const workRoutes: MetadataRoute.Sitemap = featuredWorkImages.map((project) => ({
    url: url(`/work/${project.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogCategoryRoutes: MetadataRoute.Sitemap = blogCategories
    .filter((category) => getPostsByCategory(category.slug).length > 0)
    .map((category) => ({
      url: url(`/blog/category/${category.slug}`),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  const libraryRoutes: MetadataRoute.Sitemap = libraryItems.map((item) => ({
    url: url(`/library/${item.slug}`),
    lastModified: new Date(item.publishedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...workRoutes,
    ...blogRoutes,
    ...blogCategoryRoutes,
    ...libraryRoutes,
  ];
}
