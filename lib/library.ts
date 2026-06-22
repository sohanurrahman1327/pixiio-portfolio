import type { LibraryCategory, LibraryItem, LibraryType, PlatformSlug } from "./library-types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=600&q=90`;

const CONTRIBUTOR = {
  name: "Pixiio",
  role: "UI/UX Design Agency",
  url: "/contact",
};

function item(
  slug: string,
  title: string,
  excerpt: string,
  type: LibraryType,
  platform: PlatformSlug,
  category: LibraryCategory,
  opts: Partial<LibraryItem> = {}
): LibraryItem {
  const preview = opts.previewImage ?? img("photo-1467232004584-a241de8bcf5d");
  return {
    slug,
    title,
    excerpt,
    type,
    platform,
    category,
    industry: opts.industry ?? "Digital Agency",
    style: opts.style ?? "Modern, clean UI",
    fontFamily: opts.fontFamily ?? "Inter",
    tags: opts.tags ?? ["design", "modern", "ui"],
    previewImage: preview,
    galleryImages: opts.galleryImages ?? [preview, img("photo-1558655146-9f40138edfeb")],
    figmaUrl: opts.figmaUrl ?? "https://www.figma.com/community",
    isPro: opts.isPro ?? false,
    publishedAt: opts.publishedAt ?? "2026-06-01",
    contributor: opts.contributor ?? CONTRIBUTOR,
  };
}

export const libraryItems: LibraryItem[] = [
  item(
    "utosia-a-digital-agency-2",
    "Utosia — A Digital Agency",
    "From branding to web design, we craft solutions that connect businesses with their audience.",
    "template",
    "figma",
    "landing-page",
    {
      previewImage: img("photo-1460925895917-afdab827c52f"),
      galleryImages: [
        img("photo-1460925895917-afdab827c52f"),
        img("photo-1551288049-bebda4e38f71"),
      ],
      industry: "Digital Agency",
      style: "Modern, modern UI, landing page",
      fontFamily: "Inter Tight",
      tags: ["design", "lightmode", "landing", "digitalagency", "modern", "modernui"],
      isPro: true,
      publishedAt: "2026-06-15",
    }
  ),
  item("klarheit-header-06", "Klarheit Header 06", "Clean navigation header with mega menu and CTA.", "component", "figma", "header", { isPro: true, publishedAt: "2026-06-14" }),
  item("klarheit-content-06", "Klarheit Content 06", "Feature-rich content section with image grid.", "component", "figma", "content", { isPro: true, publishedAt: "2026-06-13" }),
  item("bloomwell-pricing-03", "Bloomwell Pricing 03", "Three-tier pricing table with toggle.", "component", "figma", "pricing", { publishedAt: "2026-06-12" }),
  item("cycle-testimonial-02", "Cycle Testimonial 02", "Carousel testimonial slider with avatars.", "component", "figma", "testimonial", { tags: ["carousel", "testimonial"], publishedAt: "2026-06-11" }),
  item("agency-hero-block", "Agency Hero Block", "Full-width hero with video background placeholder.", "block", "figma", "header", { publishedAt: "2026-06-10" }),
  item("saas-pricing-block", "SaaS Pricing Block", "Comparison pricing block for SaaS products.", "block", "figma", "pricing", { industry: "SaaS", publishedAt: "2026-06-09" }),
  item("kyan-personal-portfolio", "Kyan — Personal Portfolio", "Minimal portfolio landing for creatives.", "template", "figma", "landing-page", { industry: "Digital Agency", isPro: true, publishedAt: "2026-06-08" }),
  item("taskly-task-management", "Taskly — Task Management", "SaaS task management landing page.", "template", "figma", "landing-page", { industry: "SaaS", isPro: true, publishedAt: "2026-06-07" }),
  item("elementor-agency-kit", "Elementor Agency Kit", "Complete agency website template for Elementor.", "template", "elementor", "landing-page", { isPro: true, publishedAt: "2026-06-06" }),
  item("elementor-pricing-table", "Elementor Pricing Table", "Responsive pricing widget for Elementor.", "component", "elementor", "pricing", { publishedAt: "2026-06-05" }),
  item("elementor-hero-section", "Elementor Hero Section", "Animated hero with gradient background.", "block", "elementor", "header", { publishedAt: "2026-06-04" }),
  item("wordpress-blog-theme", "WordPress Blog Theme", "Modern blog layout for WordPress.", "template", "wordpress", "blog", { publishedAt: "2026-06-03" }),
  item("wordpress-landing-kit", "WordPress Landing Kit", "High-converting landing page for WordPress.", "template", "wordpress", "landing-page", { publishedAt: "2026-06-02" }),
  item("gutenberg-hero-block", "Gutenberg Hero Block", "Block editor hero with cover image.", "block", "gutenberg", "header", { publishedAt: "2026-06-01" }),
  item("gutenberg-feature-grid", "Gutenberg Feature Grid", "Three-column feature grid block.", "block", "gutenberg", "feature", { publishedAt: "2026-05-30" }),
  item("framer-saas-landing", "Framer SaaS Landing", "Animated SaaS landing page for Framer.", "template", "framer", "landing-page", { industry: "SaaS", isPro: true, publishedAt: "2026-05-29" }),
  item("framer-nav-component", "Framer Nav Component", "Sticky navigation with scroll effects.", "component", "framer", "navigation", { publishedAt: "2026-05-28" }),
  item("webflow-ecommerce-hero", "Webflow Ecommerce Hero", "Product showcase hero for Webflow.", "block", "webflow", "header", { industry: "Ecommerce", publishedAt: "2026-05-27" }),
  item("webflow-portfolio", "Webflow Portfolio Template", "Creative portfolio template for Webflow.", "template", "webflow", "landing-page", { isPro: true, publishedAt: "2026-05-26" }),
  item("vibe-saas-dashboard", "Vibe SaaS Dashboard", "Dashboard UI built with Vibe Coding.", "template", "vibe-coding", "landing-page", { industry: "SaaS", publishedAt: "2026-05-25" }),
  item("vibe-cta-block", "Vibe CTA Block", "Conversion-focused CTA section.", "block", "vibe-coding", "cta", { publishedAt: "2026-05-24" }),
  item("figma-footer-04", "Figma Footer 04", "Multi-column footer with newsletter.", "component", "figma", "footer", { publishedAt: "2026-05-23" }),
  item("figma-team-section", "Figma Team Section", "Team grid with hover bios.", "component", "figma", "team", { publishedAt: "2026-05-22" }),
  item("figma-blog-grid", "Figma Blog Grid", "Magazine-style blog post grid.", "component", "figma", "blog", { publishedAt: "2026-05-21" }),
  item("elementor-cta-banner", "Elementor CTA Banner", "Full-width CTA with background image.", "block", "elementor", "cta", { publishedAt: "2026-05-20" }),
  item("wordpress-contact-form", "WordPress Contact Form", "Styled contact form section.", "block", "wordpress", "content", { publishedAt: "2026-05-19" }),
  item("framer-testimonial-slider", "Framer Testimonial Slider", "Auto-playing testimonial carousel.", "component", "framer", "testimonial", { tags: ["slider", "carousel"], publishedAt: "2026-05-18" }),
  item("webflow-pricing-cards", "Webflow Pricing Cards", "Tiered pricing cards with features list.", "component", "webflow", "pricing", { publishedAt: "2026-05-17" }),
  item("gutenberg-testimonial", "Gutenberg Testimonial", "Quote block with author info.", "component", "gutenberg", "testimonial", { publishedAt: "2026-05-16" }),
  item("vibe-feature-section", "Vibe Feature Section", "Bento grid feature layout.", "block", "vibe-coding", "feature", { publishedAt: "2026-05-15" }),
  item("ai-chatbot-landing", "AI Chatbot Landing", "AI product landing page template.", "template", "figma", "landing-page", { industry: "SaaS", isPro: true, publishedAt: "2026-05-14" }),
  item("echo-startup-landing", "Echo Startup Landing", "Startup landing with waitlist form.", "template", "figma", "landing-page", { industry: "Start Up", isPro: true, publishedAt: "2026-05-13" }),
  item("podcast-landing-page", "Podcast Landing Page", "Podcast show landing with episode list.", "template", "figma", "landing-page", { industry: "SaaS", publishedAt: "2026-05-12" }),
];

export const libraryTabs = [
  { slug: "components" as const, label: "Components", type: "component" as LibraryType },
  { slug: "blocks" as const, label: "Blocks", type: "block" as LibraryType },
  { slug: "templates" as const, label: "Templates", type: "template" as LibraryType },
];

export type LibraryTabSlug = (typeof libraryTabs)[number]["slug"];

export function getItemBySlug(slug: string): LibraryItem | undefined {
  return libraryItems.find((i) => i.slug === slug);
}

export function getItemDetailPath(slug: string): string {
  return `/library/${slug}`;
}

export function filterItems(opts: {
  type?: LibraryType;
  platform?: PlatformSlug;
  category?: LibraryCategory;
  tag?: string;
  query?: string;
}): LibraryItem[] {
  let results = [...libraryItems].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  if (opts.type) results = results.filter((i) => i.type === opts.type);
  if (opts.platform) results = results.filter((i) => i.platform === opts.platform);
  if (opts.category) results = results.filter((i) => i.category === opts.category);
  if (opts.tag) {
    const t = opts.tag.toLowerCase();
    results = results.filter((i) =>
      i.tags.some((tag) => tag.toLowerCase().includes(t))
    );
  }
  if (opts.query) {
    const q = opts.query.toLowerCase();
    results = results.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.excerpt.toLowerCase().includes(q) ||
        i.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return results;
}

export function getSimilarItems(item: LibraryItem, limit = 8): LibraryItem[] {
  return libraryItems
    .filter((i) => i.slug !== item.slug)
    .sort((a, b) => {
      const aScore =
        (a.category === item.category ? 2 : 0) +
        (a.platform === item.platform ? 1 : 0) +
        (a.type === item.type ? 1 : 0);
      const bScore =
        (b.category === item.category ? 2 : 0) +
        (b.platform === item.platform ? 1 : 0) +
        (b.type === item.type ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, limit);
}

export function formatLibraryDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
