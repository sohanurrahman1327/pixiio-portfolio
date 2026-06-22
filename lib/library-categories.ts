import type { LibraryCategory } from "./library-types";

export const libraryCategories: { slug: LibraryCategory; label: string }[] = [
  { slug: "header", label: "Header" },
  { slug: "navigation", label: "Navigation" },
  { slug: "content", label: "Content" },
  { slug: "feature", label: "Feature" },
  { slug: "testimonial", label: "Testimonial" },
  { slug: "pricing", label: "Pricing" },
  { slug: "footer", label: "Footer" },
  { slug: "cta", label: "CTA" },
  { slug: "team", label: "Team" },
  { slug: "blog", label: "Blog" },
  { slug: "landing-page", label: "Landing Page" },
];

export const libraryTags = [
  "Carousel",
  "Accordion",
  "Interactions",
  "Dropdown",
  "Tabs",
  "Lightbox",
  "Map",
  "Slider",
  "Marquee",
] as const;

export function getCategoryLabel(slug: LibraryCategory) {
  return libraryCategories.find((c) => c.slug === slug)?.label ?? slug;
}
