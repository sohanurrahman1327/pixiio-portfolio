import type { BlogCategorySlug, BlogPost, BlogSection, TocItem } from "./blog-types";
import { websiteRedesignChecklistSections } from "./blog-posts/website-redesign-checklist";
import { startupLandingPageDesignSections } from "./blog-posts/startup-landing-page-design";
import { elementorWebsiteDesignAgencySections } from "./blog-posts/elementor-website-design-agency";
import { websiteRedesignCostSections } from "./blog-posts/website-redesign-cost";
import { wordpressWebsiteRedesignServiceSections } from "./blog-posts/wordpress-website-redesign-service";
import { uiUxDesignAgencyForSaasStartupsSections } from "./blog-posts/ui-ux-design-agency-for-saas-startups";
import { whiteLabelWordPressDesignAgencySections } from "./blog-posts/white-label-wordpress-design-agency";
import { saasLandingPageDesignServiceSections } from "./blog-posts/saas-landing-page-design-service";

const AUTHOR = {
  name: "Pixiio Team",
  role: "Design & Development Agency",
};

export const blogPosts: BlogPost[] = [
  {
    slug: "saas-landing-page-design-service",
    title:
      "SaaS Landing Page Design Service: The Complete Guide to Building Landing Pages That Convert Visitors into Paying Customers (2026)",
    excerpt:
      "Looking for a SaaS landing page design service? Learn how to build landing pages that increase demo bookings, free trials, and customer conversions with proven UX and CRO strategies.",
    category: "saas-design",
    author: AUTHOR,
    publishedAt: "2026-07-21",
    coverImage: "/blog/saas-landing-page-design-service.webp",
    tags: [
      "SaaS landing page design service",
      "SaaS landing page",
      "conversion optimization",
      "SaaS CRO",
      "demo booking landing page",
    ],
    readingTime: 15,
    featured: true,
    sections: saasLandingPageDesignServiceSections,
  },
  {
    slug: "white-label-wordpress-design-agency",
    title:
      "White Label WordPress Design Agency: The Complete Guide for Marketing Agencies Looking to Scale Profitably (2026)",
    excerpt:
      "Looking for a white label WordPress design agency? Learn how agencies scale faster, deliver better websites, and increase profits with reliable white label partners.",
    category: "wordpress",
    author: AUTHOR,
    publishedAt: "2026-07-20",
    coverImage: "/blog/white-label-wordpress-design-agency.webp",
    tags: [
      "white label WordPress design agency",
      "white label WordPress",
      "white label web design",
      "agency scaling",
      "WordPress partnership",
    ],
    readingTime: 15,
    featured: true,
    sections: whiteLabelWordPressDesignAgencySections,
  },
  {
    slug: "ui-ux-design-agency-for-saas-startups",
    title:
      "UI/UX Design Agency for SaaS Startups: How Great Product Design Becomes Your Biggest Competitive Advantage (2026 Guide)",
    excerpt:
      "Looking for a UI/UX design agency for your SaaS startup? Learn how strategic UX improves user adoption, retention, and revenue while helping your product stand out in a competitive market.",
    category: "ui-ux",
    author: AUTHOR,
    publishedAt: "2026-07-19",
    coverImage: "/blog/ui-ux-design-agency-for-saas-startups.webp",
    tags: [
      "UI/UX design agency for SaaS startups",
      "SaaS UI/UX design",
      "SaaS UX agency",
      "product design",
      "design systems",
    ],
    readingTime: 15,
    featured: true,
    sections: uiUxDesignAgencyForSaasStartupsSections,
  },
  {
    slug: "website-redesign-cost",
    title:
      "Website Redesign Cost: How Much Does a Professional Website Redesign Really Cost in 2026?",
    excerpt:
      "Wondering how much a website redesign costs? Learn what affects pricing, how to budget wisely, and how to maximize ROI with this complete website redesign cost guide.",
    category: "website-redesign",
    author: AUTHOR,
    publishedAt: "2026-07-18",
    coverImage: "/blog/website-redesign-cost.webp",
    tags: [
      "website redesign cost",
      "website redesign pricing",
      "website redesign budget",
      "redesign ROI",
      "website investment",
    ],
    readingTime: 16,
    featured: true,
    sections: websiteRedesignCostSections,
  },
  {
    slug: "wordpress-website-redesign-service",
    title:
      "WordPress Website Redesign Service: A Complete Guide to Modernizing Your Business Website Without Losing SEO (2026)",
    excerpt:
      "Thinking about redesigning your WordPress website? Learn when to redesign, what to avoid, and how to improve conversions, SEO, and user experience with this complete guide.",
    category: "wordpress",
    author: AUTHOR,
    publishedAt: "2026-07-17",
    coverImage: "/blog/wordpress-website-redesign-service.webp",
    tags: [
      "WordPress website redesign service",
      "WordPress redesign",
      "website redesign SEO",
      "WordPress modernization",
      "business website redesign",
    ],
    readingTime: 15,
    featured: true,
    sections: wordpressWebsiteRedesignServiceSections,
  },
  {
    slug: "elementor-website-design-agency",
    title:
      "Elementor Website Design Agency: How to Choose the Right Partner for a High-Performance WordPress Website (2026 Guide)",
    excerpt:
      "Looking for an Elementor website design agency? Learn how to choose the right partner, avoid costly mistakes, and build a fast, SEO-friendly, conversion-focused WordPress website.",
    category: "wordpress",
    author: AUTHOR,
    publishedAt: "2026-07-16",
    coverImage: "/blog/elementor-website-design-agency.webp",
    tags: [
      "Elementor website design agency",
      "Elementor expert",
      "WordPress website design",
      "Elementor agency",
      "conversion-focused WordPress",
    ],
    readingTime: 14,
    featured: true,
    sections: elementorWebsiteDesignAgencySections,
  },
  {
    slug: "startup-landing-page-design",
    title:
      "Startup Landing Page Design: The Complete Guide to Turning Visitors into Customers (2026)",
    excerpt:
      "Discover how to create a startup landing page that attracts the right audience, builds trust, and converts visitors into customers. Learn the strategies used by successful SaaS startups and high-growth companies.",
    category: "saas-design",
    author: AUTHOR,
    publishedAt: "2026-07-15",
    coverImage: "/blog/startup-landing-page-design.webp",
    tags: [
      "startup landing page design",
      "landing page",
      "SaaS landing page",
      "conversion optimization",
      "startup website",
    ],
    readingTime: 16,
    featured: true,
    sections: startupLandingPageDesignSections,
  },
  {
    slug: "website-redesign-checklist",
    title:
      "Website Redesign Checklist: 15 Essential Steps Every Business Owner Should Complete Before Redesigning Their Website",
    excerpt:
      "Planning a website redesign? Follow this complete website redesign checklist to avoid costly mistakes, improve conversions, and build a website that grows your business.",
    category: "website-redesign",
    author: AUTHOR,
    publishedAt: "2026-07-14",
    coverImage: "/blog/website-redesign-checklist.webp",
    tags: [
      "website redesign checklist",
      "website redesign",
      "business website redesign",
      "website redesign agency",
      "conversion-focused website",
    ],
    readingTime: 18,
    featured: true,
    sections: websiteRedesignChecklistSections,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category?: BlogCategorySlug): BlogPost[] {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  if (!category) return sorted;
  return sorted.filter((p) => p.category === category);
}

export function getRelatedPosts(post: BlogPost, limit = 4): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aMatch = a.category === post.category ? 1 : 0;
      const bMatch = b.category === post.category ? 1 : 0;
      if (bMatch !== aMatch) return bMatch - aMatch;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, limit);
}

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatBlogDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getTocFromSections(sections: BlogSection[]): TocItem[] {
  const items: TocItem[] = [];
  let currentH2: TocItem | null = null;

  for (const section of sections) {
    if (section.type !== "heading") continue;
    const entry: TocItem = {
      id: section.id,
      text: section.text,
      level: section.level,
    };
    if (section.level === 2) {
      currentH2 = { ...entry, children: [] };
      items.push(currentH2);
    } else if (currentH2) {
      currentH2.children = currentH2.children ?? [];
      currentH2.children.push(entry);
    } else {
      items.push(entry);
    }
  }

  return items;
}

export type { TocItem };
