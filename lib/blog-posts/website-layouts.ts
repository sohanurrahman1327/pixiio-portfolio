import type { BlogSection } from "../blog-types";

const IMG = {
  layout:
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=675&fit=crop",
  types:
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=675&fit=crop",
  examples:
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=675&fit=crop",
  wistia:
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=675&fit=crop",
  saas:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
  takeaways:
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop",
  stats:
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=675&fit=crop",
} as const;

export const websiteLayoutsSections: BlogSection[] = [
  {
    type: "paragraph",
    text: "You know that feeling when you land on a website and instantly think, “Wow, this is nice”? You are not quite sure what it is. The colors might be fine. The logo looks okay. But something about the way everything is arranged just feels right. That feeling has a name: good layout design.",
  },
  {
    type: "paragraph",
    text: "The websites that nail it are not always the biggest names in the game. Some of the most impressive web page layout examples belong to focused, creative companies that have invested seriously in how their site looks, feels, and guides you through a story. This guide walks through what a website layout is, why it matters, and 20 inspiring examples you can learn from.",
  },
  {
    type: "heading",
    level: 2,
    text: "What Is a Website Layout?",
    id: "what-is-a-website-layout",
  },
  {
    type: "image",
    src: IMG.layout,
    alt: "What is a website layout — structural framework diagram",
    caption: "A website layout defines where every element lives on the page",
  },
  {
    type: "paragraph",
    text: "A website layout is the structural framework that determines where elements sit on a web page — your header, navigation, hero section, content blocks, sidebars, and footer. It decides how content is organized, how the user's eye moves through the page, how the design behaves across screen sizes, and how intuitive navigation feels.",
  },
  {
    type: "list",
    items: [
      "Single-column layout — clean, linear, great for blogs and long-form reading",
      "Multi-column layout — divides content into 2–3 columns, perfect for news and dashboards",
      "Grid layout — modular, card-based structure ideal for portfolios and ecommerce",
      "Split-screen layout — two distinct panels side by side, often used on landing pages",
      "Magazine layout — feature-rich, editorial, great for content-heavy brands",
      "Full-screen hero layout — bold visual-first design for agencies and creative studios",
      "Asymmetric layout — off-balance grid that creates visual tension and personality",
      "Single-page layout — all content on one continuous scroll, great for startups",
    ],
  },
  {
    type: "image",
    src: IMG.types,
    alt: "Common types of website layouts",
    caption: "Common types of website layouts designers work with",
  },
  {
    type: "heading",
    level: 2,
    text: "20 Stunning Website Layout Examples",
    id: "layout-examples",
  },
  {
    type: "image",
    src: IMG.examples,
    alt: "20 stunning website layout examples",
    caption: "20 Website Layouts Examples to Inspire Your Next Design",
  },
  {
    type: "heading",
    level: 3,
    text: "1. Wistia — Asymmetric Storytelling Layout",
    id: "wistia",
  },
  {
    type: "paragraph",
    text: "Wistia uses an asymmetric editorial grid where content blocks alternate between left-heavy and right-heavy compositions. Deliberate whitespace, bold typography anchors, and pastel color blocks establish hierarchy without relying on imagery alone.",
  },
  {
    type: "image",
    src: IMG.wistia,
    alt: "Wistia asymmetric storytelling website layout",
    caption: "Wistia — Asymmetric Storytelling Layout",
  },
  {
    type: "heading",
    level: 3,
    text: "2. Basecamp — Single-Page Conversion Layout",
    id: "basecamp",
  },
  {
    type: "paragraph",
    text: "Basecamp's homepage is one of the best single-page layout examples in SaaS. Problem, solution, proof, pricing, and CTA flow naturally. Bold oversized headlines act as section anchors, and customer testimonials are woven throughout rather than buried at the bottom.",
  },
  {
    type: "image",
    src: IMG.saas,
    alt: "Basecamp single-page conversion layout",
    caption: "Basecamp — Single-Page Conversion Layout",
  },
  {
    type: "heading",
    level: 3,
    text: "3. Figma — Split-Screen Hero with Animated Demo",
    id: "figma",
  },
  {
    type: "paragraph",
    text: "Figma's split-screen hero puts the value proposition on the left and a live animated product demo on the right. The split creates visual tension that pulls the eye toward the CTA — one of the best homepage layout examples in the design tools space.",
  },
  {
    type: "heading",
    level: 3,
    text: "4. Monzo — Magazine-Style Mobile-First Layout",
    id: "monzo",
  },
  {
    type: "paragraph",
    text: "Monzo's modular card grid divides features into sections with their own visual identity while maintaining brand coherence. Coral accent color, illustrative icons, and alternating full-width sections add rhythm without clutter.",
  },
  {
    type: "heading",
    level: 3,
    text: "5. Pitch — Dark Mode Dashboard Layout",
    id: "pitch",
  },
  {
    type: "paragraph",
    text: "Pitch uses a dark-mode layout that doubles as a live product demo. A fixed left sidebar mimics the product navigation while the main content area scrolls like a canvas — immersive from the first second.",
  },
  {
    type: "heading",
    level: 3,
    text: "6. Notion — Minimal Grid with Radical Whitespace",
    id: "notion",
  },
  {
    type: "paragraph",
    text: "Notion succeeds by doing almost nothing perfectly: extreme whitespace, centered single-column hero, clean two-column feature grid with interactive previews, and no distracting animations.",
  },
  {
    type: "heading",
    level: 3,
    text: "7. Loom — Video-Forward Hero Layout",
    id: "loom",
  },
  {
    type: "paragraph",
    text: "Loom puts an auto-playing product demo front and center inside a browser-frame mockup. CTAs appear contextually during scroll — a standout landing page layout for products where seeing is believing.",
  },
  {
    type: "heading",
    level: 3,
    text: "8. Framer — Canvas-Based Experimental Layout",
    id: "framer",
  },
  {
    type: "paragraph",
    text: "Framer's site uses parallax depth, massive display typography, and color shifts from dark to light. Every element feels deliberate — the kind of website layout inspiration designers screenshot and revisit.",
  },
  {
    type: "heading",
    level: 3,
    text: "9. Linear — Gradient Grid with Micro-Interactions",
    id: "linear",
  },
  {
    type: "paragraph",
    text: "Linear uses a deep dark background with gradient accents. A centered hero transitions into a three-column feature grid with animated gradient borders on hover and extremely deliberate typography hierarchy.",
  },
  {
    type: "heading",
    level: 3,
    text: "10. Headspace — Calm Split Layout with Illustration",
    id: "headspace",
  },
  {
    type: "paragraph",
    text: "Headspace alternates split-screen sections pairing illustration with text. Pastel color blocking replaces borders, and scroll animations are slow and gentle — perfect for wellness brands.",
  },
  {
    type: "heading",
    level: 3,
    text: "11. Shopify — E-commerce Hero with Trust Stack",
    id: "shopify",
  },
  {
    type: "paragraph",
    text: "Shopify's hero splits headline and trial form. Below the fold, recognizable brand logos provide instant trust, feature sections use zig-zag alternating layout, and the footer is a clean five-column grid.",
  },
  {
    type: "heading",
    level: 3,
    text: "12. Webflow — Interactive Education Layout",
    id: "webflow",
  },
  {
    type: "paragraph",
    text: "Webflow uses horizontal scroll sections within vertical scroll and a magazine-style blog grid. Color-coded navigation helps users orient quickly — ideal for education-heavy brands.",
  },
  {
    type: "heading",
    level: 3,
    text: "13. Superhuman — Ultra-Minimal Above-the-Fold",
    id: "superhuman",
  },
  {
    type: "paragraph",
    text: "Superhuman keeps the hero to a centered headline, two sentences, and one CTA. Animated feature showcases appear one at a time on scroll — confidence in the product means you don't over-explain.",
  },
  {
    type: "heading",
    level: 3,
    text: "14. Mailchimp — Playful Modular Card Layout",
    id: "mailchimp",
  },
  {
    type: "paragraph",
    text: "Mailchimp uses illustration-heavy cards that vary in size and color, creating a collage-like energetic grid. Playful but clear hierarchy: headline → subtext → CTA.",
  },
  {
    type: "heading",
    level: 3,
    text: "15. Intercom — Documentation-Style Dense Content",
    id: "intercom",
  },
  {
    type: "paragraph",
    text: "Intercom packages dense B2B content into scannable chunks with large feature headlines, side-by-side comparison grids, sticky navigation, and metric-forward case study cards.",
  },
  {
    type: "heading",
    level: 3,
    text: "16. Unsplash — Masonry Grid Portfolio Layout",
    id: "unsplash",
  },
  {
    type: "paragraph",
    text: "Unsplash's masonry grid stacks images of varying heights fluidly. Hover reveals metadata cleanly, infinite scroll with lazy loading, and minimal top navigation keep UX fast.",
  },
  {
    type: "heading",
    level: 3,
    text: "17. Typeform — Full-Screen Slide Layout",
    id: "typeform",
  },
  {
    type: "paragraph",
    text: "Typeform mirrors its product with full-screen conversation-style slides. One message, one visual, one action per viewport — more product demo than traditional marketing page.",
  },
  {
    type: "heading",
    level: 3,
    text: "18. Miro — Zoomable Canvas Layout",
    id: "miro",
  },
  {
    type: "paragraph",
    text: "Miro opens on an infinite whiteboard that zooms out to reveal the product name. Below, a clean two-column grid with tab-based feature sections makes a complex product instantly understandable.",
  },
  {
    type: "heading",
    level: 3,
    text: "19. Craft Docs — Magazine Editorial Layout",
    id: "craft",
  },
  {
    type: "paragraph",
    text: "Craft borrows from high-end editorial magazines: cinematic hero with device frames, alternating editorial text and visual showcases, and color palettes that shift per section.",
  },
  {
    type: "heading",
    level: 3,
    text: "20. Canny — Sticky-Scroll Product Demo Layout",
    id: "canny",
  },
  {
    type: "paragraph",
    text: "Canny anchors the layout with a fixed product view on the left while feature callouts scroll on the right. Social proof is inline throughout — making a complex product feel instantly clear.",
  },
  {
    type: "heading",
    level: 2,
    text: "Key Takeaways: What Great Layouts Share",
    id: "key-takeaways",
  },
  {
    type: "image",
    src: IMG.takeaways,
    alt: "What stunning website layouts have in common",
    caption: "What Stunning Website Layouts Have in Common",
  },
  {
    type: "list",
    items: [
      "Intentional whitespace — negative space is a design element, not an afterthought",
      "Hierarchy before decoration — size, contrast, and placement communicate what matters",
      "Mobile-first thinking — responsive layouts are built for small screens, enhanced upward",
      "The layout tells a story — attention → interest → proof → action",
      "Consistency with variety — grids provide structure; breaking the grid creates emphasis",
      "Speed is a layout decision — lightweight layouts improve both UX and SEO",
    ],
  },
  {
    type: "heading",
    level: 2,
    text: "Why Website Layout Design Actually Matters",
    id: "why-layout-matters",
  },
  {
    type: "image",
    src: IMG.stats,
    alt: "Why website layout design matters for conversions",
    caption: "Layout quality directly impacts credibility and conversions",
  },
  {
    type: "paragraph",
    text: "Research consistently shows that users judge credibility and engagement based on layout quality. Adobe found 38% of people stop engaging if content or layout is unattractive. With over 60% of web traffic on mobile, responsive layout is baseline — not optional. Your layout does sales work before your copy gets a chance to speak.",
  },
  {
    type: "heading",
    level: 2,
    text: "How Pixiio Helps You Build a Stunning Layout",
    id: "how-pixiio-helps",
  },
  {
    type: "paragraph",
    text: "Most of the layouts above were built by professional design teams over weeks. You don't need a full in-house team to achieve the same quality — you need the right partner and process.",
  },
  {
    type: "callout",
    title: "Design + Development, End to End",
    text: "Pixiio designs and builds conversion-ready websites in WordPress, Elementor, and modern stacks. From wireframe to launch, we match layout structure to your goals — whether that's a SaaS landing page, a portfolio grid, or a full business redesign.",
  },
  {
    type: "list",
    items: [
      "Custom layout strategy aligned to your audience and conversion goals",
      "Responsive design tested across devices before launch",
      "Elementor and WordPress builds with performance optimization built in",
      "UI/UX audits to fix hierarchy, spacing, and navigation issues",
      "Industry-specific templates adapted to your brand — not generic themes",
    ],
  },
  {
    type: "heading",
    level: 2,
    text: "Frequently Asked Questions",
    id: "faq",
  },
  {
    type: "heading",
    level: 3,
    text: "What is a website layout?",
    id: "faq-what-is-layout",
  },
  {
    type: "paragraph",
    text: "A website layout is the structural arrangement of visual elements on a page — header, navigation, content sections, sidebars, and footer. It determines organization, navigation, and responsiveness.",
  },
  {
    type: "heading",
    level: 3,
    text: "What are the most common layout types?",
    id: "faq-layout-types",
  },
  {
    type: "paragraph",
    text: "Single-column, multi-column, grid, split-screen, full-screen hero, magazine, single-page scroll, and asymmetric layouts. Each serves different content types and conversion goals.",
  },
  {
    type: "heading",
    level: 3,
    text: "How do I choose the right layout?",
    id: "faq-choose-layout",
  },
  {
    type: "paragraph",
    text: "Start with your primary goal. Conversions → single-page or landing layout. Showcasing work → grid or masonry. Lots of content → magazine layout. Match structure to content and audience.",
  },
  {
    type: "heading",
    level: 3,
    text: "Are responsive layouts important for SEO?",
    id: "faq-responsive-seo",
  },
  {
    type: "paragraph",
    text: "Yes. Google uses mobile-first indexing. A poor responsive design can hurt rankings directly. Fast, well-structured responsive layouts are a significant SEO asset.",
  },
];

export const websiteLayoutsFaqs = [
  {
    question: "What is a website layout?",
    answer:
      "The structural arrangement of visual elements on a page — header, navigation, content, and footer — that determines organization and responsiveness.",
  },
  {
    question: "What makes a good website layout?",
    answer:
      "Clear visual hierarchy, intentional whitespace, consistent grid structure, and responsive design that guides users effortlessly toward key information.",
  },
  {
    question: "Can I build professional layouts without coding?",
    answer:
      "Yes. With WordPress and Elementor — paired with expert design — you can build professional layouts without writing code. Pixiio handles both design and implementation.",
  },
];
