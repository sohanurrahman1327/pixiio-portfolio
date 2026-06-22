import type { PlatformSlug } from "./library-types";

export type Platform = {
  slug: PlatformSlug;
  label: string;
  copyLabel: string;
  icon: string;
};

export const libraryPlatforms: Platform[] = [
  { slug: "wordpress", label: "WordPress", copyLabel: "Copy to WordPress", icon: "W" },
  { slug: "figma", label: "Figma", copyLabel: "Copy to Figma", icon: "F" },
  { slug: "elementor", label: "Elementor", copyLabel: "Copy to Elementor", icon: "E" },
  { slug: "gutenberg", label: "Gutenberg", copyLabel: "Copy to Gutenberg", icon: "G" },
  { slug: "framer", label: "Framer", copyLabel: "Copy to Framer", icon: "Fr" },
  { slug: "webflow", label: "Webflow", copyLabel: "Copy to Webflow", icon: "Wf" },
  { slug: "vibe-coding", label: "Vibe Coding", copyLabel: "Copy to Vibe", icon: "V" },
];

export function getPlatform(slug: PlatformSlug) {
  return libraryPlatforms.find((p) => p.slug === slug);
}

export function getPlatformLabel(slug: PlatformSlug) {
  return getPlatform(slug)?.label ?? slug;
}
