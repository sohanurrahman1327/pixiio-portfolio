export type LibraryType = "component" | "block" | "template";

export type PlatformSlug =
  | "wordpress"
  | "figma"
  | "elementor"
  | "gutenberg"
  | "framer"
  | "webflow"
  | "vibe-coding";

export type LibraryCategory =
  | "header"
  | "navigation"
  | "content"
  | "feature"
  | "testimonial"
  | "pricing"
  | "footer"
  | "cta"
  | "team"
  | "blog"
  | "landing-page";

export type LibraryItem = {
  slug: string;
  title: string;
  excerpt: string;
  type: LibraryType;
  platform: PlatformSlug;
  category: LibraryCategory;
  industry: string;
  style: string;
  fontFamily: string;
  tags: string[];
  previewImage: string;
  galleryImages: string[];
  figmaUrl?: string;
  isPro?: boolean;
  publishedAt: string;
  contributor: { name: string; role: string; url?: string };
};
