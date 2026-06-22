import type { BlogCategorySlug, BlogPost, BlogSection, TocItem } from "./blog-types";
import { websiteLayoutsSections } from "./blog-posts/website-layouts";

const COVER_IMAGES = {
  redesign:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop",
  saas: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop",
  wordpress:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&h=600&fit=crop",
  uiux: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&h=600&fit=crop",
  industry:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=600&fit=crop",
  layouts:
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=900&h=600&fit=crop",
} as const;

const AUTHOR = {
  name: "Pixiio Team",
  role: "Design & Development Agency",
};

function stubSections(title: string, excerpt: string, points: string[]): BlogSection[] {
  return [
    { type: "paragraph", text: excerpt },
    {
      type: "heading",
      level: 2,
      text: "Why This Matters in 2026",
      id: "why-it-matters",
    },
    {
      type: "paragraph",
      text: `As digital competition intensifies, ${title.toLowerCase()} has become a core growth lever — not a nice-to-have. Brands that invest in clarity, speed, and conversion-focused design consistently outperform those running on outdated assumptions.`,
    },
    {
      type: "heading",
      level: 2,
      text: "Key Points to Know",
      id: "key-points",
    },
    { type: "list", items: points },
    {
      type: "heading",
      level: 2,
      text: "How Pixiio Can Help",
      id: "how-pixiio-helps",
    },
    {
      type: "callout",
      title: "Ready to take the next step?",
      text: "Pixiio designs and builds high-converting websites for startups, SaaS companies, and local businesses. Book a discovery call and we'll map a plan tailored to your goals.",
    },
  ];
}

function post(
  slug: string,
  title: string,
  excerpt: string,
  category: BlogCategorySlug,
  tags: string[],
  publishedAt: string,
  coverImage: string,
  sections: BlogSection[],
  readingTime = 6,
  featured = false
): BlogPost {
  return {
    slug,
    title,
    excerpt,
    category,
    author: AUTHOR,
    publishedAt,
    coverImage,
    tags,
    readingTime,
    sections,
    featured,
  };
}

export const blogPosts: BlogPost[] = [
  post(
    "best-website-layouts-examples",
    "20 Website Layouts Examples to Inspire Your Next Design",
    "Explore the best website layouts examples to inspire your next design. Discover modern layouts and tips to create a converting website.",
    "ui-ux",
    [
      "website layouts examples",
      "website layout examples",
      "web page layout examples",
      "modern website layout examples",
      "responsive website layout",
    ],
    "2026-05-02",
    COVER_IMAGES.layouts,
    websiteLayoutsSections,
    18,
    true
  ),
  post(
    "signs-your-website-needs-a-redesign",
    "Signs Your Website Needs a Redesign",
    "Is your site costing you leads? Here are the clearest signals it's time for a full website redesign — and what to do next.",
    "website-redesign",
    ["website redesign", "redesign signals", "outdated website"],
    "2026-05-18",
    COVER_IMAGES.redesign,
    stubSections("Signs Your Website Needs a Redesign", "An outdated website doesn't just look bad — it erodes trust, hurts SEO, and bleeds conversions. If you're seeing any of these signs, a redesign should be on your roadmap.", [
      "Bounce rate is high and time-on-page is low across key landing pages",
      "Mobile experience feels cramped, slow, or hard to navigate",
      "Brand has evolved but the website still reflects an older identity",
      "Competitors' sites feel noticeably more modern and trustworthy",
      "Lead forms and CTAs get clicks but rarely convert",
    ])
  ),
  post(
    "website-redesign-cost-2026",
    "Website Redesign Cost in 2026",
    "What does a professional website redesign actually cost in 2026? A transparent breakdown by scope, platform, and agency tier.",
    "website-redesign",
    ["website redesign cost", "redesign website cost", "website redesign agency"],
    "2026-05-15",
    COVER_IMAGES.redesign,
    stubSections("Website Redesign Cost in 2026", "Redesign pricing varies widely — from template refreshes to full custom builds. Understanding what drives cost helps you budget realistically and avoid surprises.", [
      "Template refresh: $2,000–$8,000 for small business sites",
      "Custom WordPress/Elementor redesign: $8,000–$25,000+",
      "SaaS or product marketing site: $15,000–$50,000+",
      "Cost drivers include page count, custom features, content, and integrations",
      "Ongoing maintenance and optimization should be factored into total investment",
    ])
  ),
  post(
    "before-after-website-redesign-examples",
    "Before vs After Website Redesign Examples",
    "Real before-and-after redesign patterns that improved clarity, trust, and conversions — with lessons you can apply to your own site.",
    "website-redesign",
    ["website redesign examples", "before after redesign", "website makeover"],
    "2026-05-12",
    COVER_IMAGES.redesign,
    stubSections("Before vs After Website Redesign Examples", "The best redesigns aren't just prettier — they restructure information, sharpen messaging, and remove friction from the user journey.", [
      "Hero sections shift from vague taglines to specific value propositions",
      "Navigation simplifies from 12 links to 5 focused paths",
      "Typography and spacing create clearer visual hierarchy",
      "Social proof moves above the fold instead of buried in the footer",
      "Page speed improvements often accompany visual upgrades",
    ])
  ),
  post(
    "saas-website-redesign-checklist",
    "SaaS Website Redesign Checklist",
    "A step-by-step checklist for SaaS companies planning a website redesign — from audit to launch without breaking SEO or demos.",
    "website-redesign",
    ["SaaS website redesign", "redesign checklist", "SaaS marketing site"],
    "2026-05-10",
    COVER_IMAGES.redesign,
    stubSections("SaaS Website Redesign Checklist", "SaaS redesigns have unique stakes: product demos, pricing pages, and integration docs all need to stay coherent through the transition.", [
      "Audit current analytics, heatmaps, and conversion funnels",
      "Map core user journeys: awareness → trial → activation",
      "Preserve SEO equity with proper redirects and URL structure",
      "Prototype key pages (homepage, pricing, product) before full build",
      "Plan a phased launch with A/B testing on high-traffic pages",
    ])
  ),
  post(
    "small-business-website-redesign-guide",
    "Small Business Website Redesign Guide",
    "A practical redesign guide for small businesses — how to plan, budget, and launch a site that actually brings in customers.",
    "website-redesign",
    ["small business website redesign", "local business website", "website redesign guide"],
    "2026-05-08",
    COVER_IMAGES.redesign,
    stubSections("Small Business Website Redesign Guide", "Small businesses don't need enterprise budgets to get a site that converts. They need clarity, speed, and a partner who understands local customer behavior.", [
      "Start with your #1 business goal: calls, bookings, or online sales",
      "Gather testimonials, case photos, and service descriptions early",
      "Choose a platform that you can update without a developer",
      "Prioritize mobile speed — most local searches happen on phones",
      "Launch with analytics and a clear CTA on every key page",
    ])
  ),
  post(
    "best-saas-landing-page-examples",
    "Best SaaS Landing Page Examples",
    "Study the highest-converting SaaS landing pages and learn the layout, copy, and CTA patterns that drive signups.",
    "saas-design",
    ["SaaS landing page", "SaaS website design", "landing page examples"],
    "2026-05-20",
    COVER_IMAGES.saas,
    stubSections("Best SaaS Landing Page Examples", "Great SaaS landing pages share a formula: sharp headline, visual proof, social validation, and a frictionless path to trial.", [
      "Hero with specific outcome-focused headline, not feature lists",
      "Product screenshot or interactive demo above the fold",
      "Logo bar or testimonial for instant credibility",
      "Feature sections that mirror the user's workflow",
      "Single primary CTA repeated at logical scroll breakpoints",
    ])
  ),
  post(
    "saas-website-design-trends-2026",
    "SaaS Website Design Trends 2026",
    "The SaaS design trends shaping 2026 — from dark mode heroes to interactive demos and AI-powered personalization.",
    "saas-design",
    ["SaaS website design", "SaaS design trends 2026", "SaaS UI"],
    "2026-05-17",
    COVER_IMAGES.saas,
    stubSections("SaaS Website Design Trends 2026", "SaaS websites in 2026 are less brochure, more product experience. The best sites let users feel the product before they sign up.", [
      "Interactive product demos embedded in the homepage",
      "Dark mode and gradient accents for premium positioning",
      "Bento-grid feature layouts replacing long bullet lists",
      "Micro-animations that guide attention without distraction",
      "Comparison pages and ROI calculators for bottom-funnel visitors",
    ])
  ),
  post(
    "saas-homepage-best-practices",
    "SaaS Homepage Best Practices",
    "What every high-performing SaaS homepage gets right — structure, messaging hierarchy, and conversion psychology.",
    "saas-design",
    ["SaaS homepage", "SaaS UX", "homepage best practices"],
    "2026-05-14",
    COVER_IMAGES.saas,
    stubSections("SaaS Homepage Best Practices", "Your homepage has one job: convince the right visitor they're in the right place — and give them a clear next step.", [
      "Lead with the outcome your product delivers, not its category",
      "Show the product within 3 seconds of landing",
      "Use customer logos and metrics for social proof",
      "Address the top 3 objections before the pricing section",
      "Keep navigation minimal — reduce exit points on the homepage",
    ])
  ),
  post(
    "saas-conversion-optimization-guide",
    "SaaS Conversion Optimization Guide",
    "A practical guide to improving SaaS website conversion rates — from headline tests to pricing page structure.",
    "saas-design",
    ["SaaS conversion", "conversion optimization", "SaaS CRO"],
    "2026-05-11",
    COVER_IMAGES.saas,
    stubSections("SaaS Conversion Optimization Guide", "Small conversion improvements compound. A 15% lift on homepage-to-trial rate can transform your unit economics.", [
      "Run headline A/B tests with outcome vs. feature framing",
      "Reduce form fields on trial signup to email + password only",
      "Add live chat or chatbot on pricing and comparison pages",
      "Use heatmaps to find where users drop off in the scroll",
      "Align ad landing pages with homepage messaging for consistency",
    ])
  ),
  post(
    "saas-ux-mistakes",
    "SaaS UX Mistakes That Kill Conversions",
    "The most common SaaS UX mistakes — and how to fix them before they cost you trials and revenue.",
    "saas-design",
    ["SaaS UX", "SaaS UX mistakes", "product design"],
    "2026-05-09",
    COVER_IMAGES.saas,
    stubSections("SaaS UX Mistakes That Kill Conversions", "Even beautiful SaaS sites fail when UX creates confusion. These mistakes show up on almost every site we audit.", [
      "Jargon-heavy headlines that don't communicate value in 5 seconds",
      "Feature dumps without explaining who each feature is for",
      "Pricing pages that hide the actual cost behind 'Contact Sales'",
      "Navigation with too many product tiers and sub-pages",
      "No clear differentiation from competitors on the homepage",
    ])
  ),
  post(
    "elementor-vs-framer",
    "Elementor vs Framer: Which Should You Choose?",
    "Elementor vs Framer compared for business websites — flexibility, cost, performance, and who each platform suits best.",
    "wordpress",
    ["Elementor expert", "Elementor vs Framer", "WordPress website design"],
    "2026-05-19",
    COVER_IMAGES.wordpress,
    stubSections("Elementor vs Framer", "Both tools can produce stunning sites, but they serve different needs. Choosing wrong means rebuilding in 12 months.", [
      "Elementor: best for content-heavy WordPress sites you can self-manage",
      "Framer: best for design-forward marketing sites with animation focus",
      "Elementor has a larger plugin ecosystem and SEO tooling",
      "Framer offers superior design control but less CMS flexibility",
      "Budget and team skills should drive the decision, not trends",
    ])
  ),
  post(
    "elementor-landing-page-examples",
    "Elementor Landing Page Examples",
    "Inspiring Elementor landing page examples and the layout patterns that make them convert.",
    "wordpress",
    ["Elementor landing page", "Elementor designer", "WordPress landing page"],
    "2026-05-16",
    COVER_IMAGES.wordpress,
    stubSections("Elementor Landing Page Examples", "Elementor's flexibility means landing pages can range from generic to exceptional. The difference is always in layout decisions.", [
      "Single-column scroll layouts for ad campaign landing pages",
      "Split-screen heroes with form on the right for lead gen",
      "Testimonial-heavy mid-sections for service businesses",
      "Sticky CTAs on long-form sales pages",
      "Mobile-optimized forms with minimal field count",
    ])
  ),
  post(
    "wordpress-website-cost",
    "WordPress Website Cost: What to Expect in 2026",
    "A clear breakdown of WordPress website costs — hosting, design, development, and ongoing maintenance.",
    "wordpress",
    ["WordPress website design", "WordPress website cost", "WordPress agency"],
    "2026-05-13",
    COVER_IMAGES.wordpress,
    stubSections("WordPress Website Cost", "WordPress is often marketed as 'free' — but a professional business site involves design, development, hosting, and maintenance investments.", [
      "DIY with premium theme: $500–$2,000 first year",
      "Agency-built business site: $3,000–$15,000",
      "Custom Elementor build with integrations: $8,000–$30,000",
      "Hosting: $15–$100/month depending on traffic",
      "Maintenance and updates: $50–$300/month for peace of mind",
    ])
  ),
  post(
    "best-elementor-templates",
    "Best Elementor Templates for Business Websites",
    "Our curated picks for the best Elementor templates — and when to use a template vs. custom design.",
    "wordpress",
    ["best Elementor templates", "Elementor expert", "WordPress design"],
    "2026-05-07",
    COVER_IMAGES.wordpress,
    stubSections("Best Elementor Templates", "Templates accelerate launches, but picking the wrong one leads to a site that looks like everyone else's.", [
      "Choose templates that match your content structure, not just aesthetics",
      "Prioritize templates with strong mobile layouts out of the box",
      "Customize typography and colors immediately — don't ship stock styling",
      "Remove unused sections and widgets to keep performance fast",
      "Consider custom design when brand differentiation is a priority",
    ])
  ),
  post(
    "elementor-optimization-guide",
    "Elementor Optimization Guide: Speed & Performance",
    "How to optimize Elementor sites for Core Web Vitals — without sacrificing design quality.",
    "wordpress",
    ["Elementor optimization", "WordPress performance", "Core Web Vitals"],
    "2026-05-05",
    COVER_IMAGES.wordpress,
    stubSections("Elementor Optimization Guide", "Elementor sites can be fast — or painfully slow. Performance comes down to asset management and smart build practices.", [
      "Use a lightweight theme or Elementor's Hello theme as base",
      "Limit custom fonts to 2 families with font-display: swap",
      "Enable lazy loading for images and defer non-critical scripts",
      "Audit and remove unused Elementor widgets and global styles",
      "Use a CDN and caching plugin for production environments",
    ])
  ),
  post(
    "ui-vs-ux",
    "UI vs UX: What's the Difference?",
    "UI vs UX explained clearly — what each discipline covers, how they work together, and why both matter for your product.",
    "ui-ux",
    ["UI design", "UX design", "UI vs UX"],
    "2026-05-21",
    COVER_IMAGES.uiux,
    stubSections("UI vs UX", "UI and UX are often used interchangeably, but they solve different problems. Confusing them leads to beautiful sites that don't convert.", [
      "UX (User Experience): research, flows, information architecture, usability",
      "UI (User Interface): visual design, typography, color, components, spacing",
      "UX comes first — understand the problem before designing the interface",
      "Great UX with poor UI feels untrustworthy; great UI with poor UX feels confusing",
      "Both disciplines should collaborate from wireframe through launch",
    ])
  ),
  post(
    "ux-audit-guide",
    "UX Audit Guide: How to Find & Fix Usability Issues",
    "A step-by-step UX audit guide — identify friction points, prioritize fixes, and measure improvement.",
    "ui-ux",
    ["UX audit", "UX design", "usability testing"],
    "2026-05-06",
    COVER_IMAGES.uiux,
    stubSections("UX Audit Guide", "A UX audit reveals why users leave without converting. It's the fastest way to find high-impact fixes before a full redesign.", [
      "Review analytics: bounce rate, exit pages, funnel drop-offs",
      "Walk through top 5 user journeys on desktop and mobile",
      "Check accessibility basics: contrast, focus states, alt text",
      "Test forms and CTAs — are they visible and frictionless?",
      "Prioritize fixes by impact vs. effort, then measure after 30 days",
    ])
  ),
  post(
    "design-system-guide",
    "Design System Guide for Growing Brands",
    "How to build a design system that scales — components, tokens, documentation, and governance.",
    "ui-ux",
    ["design system", "UI design", "product design"],
    "2026-05-04",
    COVER_IMAGES.uiux,
    stubSections("Design System Guide", "Without a design system, every new page is designed from scratch. With one, your brand stays consistent as you scale.", [
      "Start with foundations: color, typography, spacing, and grid",
      "Document components: buttons, forms, cards, navigation patterns",
      "Create Figma libraries that mirror your live codebase",
      "Establish naming conventions and version control for components",
      "Review and evolve the system quarterly as the product grows",
    ])
  ),
  post(
    "figma-best-practices",
    "Figma Best Practices for Web Design Teams",
    "Figma workflows that keep design projects organized, collaborative, and developer-friendly.",
    "ui-ux",
    ["Figma best practices", "UI design", "design workflow"],
    "2026-05-03",
    COVER_IMAGES.uiux,
    stubSections("Figma Best Practices", "Messy Figma files slow down projects and create handoff nightmares. Good habits save hours every week.", [
      "Use auto-layout for all components — no manual positioning",
      "Name layers and frames consistently for developer handoff",
      "Create a shared component library with variants",
      "Use styles for colors and typography — never hardcode hex values",
      "Prototype key interactions before moving to development",
    ])
  ),
  post(
    "user-journey-mapping",
    "User Journey Mapping: A Practical Guide",
    "How to map user journeys that reveal opportunities for better UX and higher conversions.",
    "ui-ux",
    ["user journey mapping", "UX design", "customer journey"],
    "2026-05-01",
    COVER_IMAGES.uiux,
    stubSections("User Journey Mapping", "Journey maps turn assumptions into visible touchpoints — showing exactly where users struggle and where you can intervene.", [
      "Define personas and their primary goals on your site",
      "Map stages: awareness → consideration → decision → retention",
      "Identify emotions and pain points at each touchpoint",
      "Highlight moments of truth where users decide to convert or leave",
      "Align design and content improvements to the weakest journey stages",
    ])
  ),
  post(
    "restaurant-website-design",
    "Restaurant Website Design: What Actually Drives Reservations",
    "Restaurant website design essentials — menus, reservations, photos, and mobile UX that fills tables.",
    "industry-guides",
    ["restaurant website design", "restaurant web design agency"],
    "2026-05-22",
    COVER_IMAGES.industry,
    stubSections("Restaurant Website Design", "Hungry customers decide in seconds. Your restaurant site needs mouth-watering visuals and frictionless booking.", [
      "High-quality food photography above the fold",
      "Online reservation or ordering integrated prominently",
      "Mobile-friendly menu with prices and dietary info",
      "Location, hours, and parking info visible without scrolling",
      "Google reviews or testimonials for social proof",
    ])
  ),
  post(
    "real-estate-website-design",
    "Real Estate Website Design Guide",
    "How to design a real estate website that generates leads — IDX integration, property search, and agent branding.",
    "industry-guides",
    ["real estate website design", "real estate web design agency"],
    "2026-05-20",
    COVER_IMAGES.industry,
    stubSections("Real Estate Website Design", "Real estate buyers and sellers judge agents by their website before the first call. Professional design builds instant credibility.", [
      "Prominent property search with map and filter functionality",
      "Agent bio and credentials above the fold",
      "Lead capture forms on every listing and neighborhood page",
      "Fast-loading image galleries for property showcases",
      "Blog content for local SEO and neighborhood authority",
    ])
  ),
  post(
    "law-firm-website-design",
    "Law Firm Website Design Best Practices",
    "Law firm website design that builds trust — practice area pages, attorney profiles, and conversion-focused layouts.",
    "industry-guides",
    ["law firm website design", "law firm web design agency"],
    "2026-05-18",
    COVER_IMAGES.industry,
    stubSections("Law Firm Website Design", "Legal clients need confidence before they pick up the phone. Your site must communicate expertise, authority, and approachability.", [
      "Clear practice area pages with specific case types",
      "Attorney profiles with credentials, photos, and personal bios",
      "Prominent phone number and consultation request forms",
      "Client testimonials and case results (where ethically permitted)",
      "Professional photography — stock suits don't build trust",
    ])
  ),
  post(
    "dental-website-design",
    "Dental Website Design That Brings in Patients",
    "Dental website design guide — online booking, service pages, before/after galleries, and local SEO essentials.",
    "industry-guides",
    ["dental website design", "dental web design agency"],
    "2026-05-16",
    COVER_IMAGES.industry,
    stubSections("Dental Website Design", "Patients choose dentists partly based on the website. A modern, reassuring site directly impacts new patient bookings.", [
      "Online appointment booking above the fold",
      "Service pages for each treatment with plain-language explanations",
      "Before/after gallery for cosmetic procedures",
      "Insurance and payment information clearly listed",
      "Team photos and office tour to reduce first-visit anxiety",
    ])
  ),
  post(
    "construction-website-design",
    "Construction Website Design Guide",
    "Construction company website design — project portfolios, service areas, and lead generation for contractors.",
    "industry-guides",
    ["construction website design", "construction web design agency"],
    "2026-05-14",
    COVER_IMAGES.industry,
    stubSections("Construction Website Design", "Contractors win bids partly on perceived professionalism. A strong portfolio site proves you deliver quality work.", [
      "Project portfolio with photos, scope, and completion timeline",
      "Service area map and licensing/insurance credentials",
      "Quote request forms on every service page",
      "Client testimonials with project references",
      "Mobile-optimized site — many searches happen on job sites",
    ])
  ),
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
