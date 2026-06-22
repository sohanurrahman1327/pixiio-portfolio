import type { BlogCategory, BlogCategorySlug } from "./blog-types";

export const blogCategories: BlogCategory[] = [
  {
    slug: "website-redesign",
    label: "Website Redesign",
    description: "Guides for clients ready to refresh outdated sites and improve conversions.",
    keywords: [
      "website redesign",
      "website redesign agency",
      "website redesign services",
      "redesign website cost",
    ],
  },
  {
    slug: "saas-design",
    label: "SaaS Design",
    description: "Landing pages, product UX, and conversion-focused SaaS website strategies.",
    keywords: [
      "SaaS website design",
      "SaaS landing page",
      "SaaS UX",
      "SaaS UI design",
    ],
  },
  {
    slug: "wordpress",
    label: "WordPress",
    description: "Elementor expertise, WordPress builds, and performance optimization.",
    keywords: [
      "Elementor expert",
      "Elementor designer",
      "WordPress landing page",
      "WordPress website design",
    ],
  },
  {
    slug: "ui-ux",
    label: "UI/UX",
    description: "Design systems, audits, and product design best practices.",
    keywords: ["UI design", "UX design", "design system", "product design"],
  },
  {
    slug: "industry-guides",
    label: "Industry Guides",
    description: "Website design playbooks for local and niche businesses.",
    keywords: ["industry website design", "industry web design agency"],
  },
];

export function getCategoryLabel(slug: BlogCategorySlug): string {
  return blogCategories.find((c) => c.slug === slug)?.label ?? slug;
}
