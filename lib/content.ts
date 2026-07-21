import { serviceImages } from "@/lib/images";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site-config";

export const services = [
  {
    title: "BRANDING",
    slug: "branding",
    description:
      "Building memorable brand identities that stand out. From logos to full brand guidelines, we define who you are.",
    longDescription:
      "Your brand is more than a logo. We craft cohesive visual identities, color, typography, voice, and assets, that make your business instantly recognizable and trusted.",
    image: serviceImages.branding,
    bg: "bg-background",
    deliverables: [
      "Logo design (Illustrator)",
      "Color palette & typography",
      "Brand guidelines PDF",
      "Business card & stationery",
      "Social media brand kit",
    ],
  },
  {
    title: "UI DESIGN",
    slug: "ui-design",
    description:
      "Crafting intuitive, beautiful interfaces that users love. We turn complex ideas into seamless digital experiences.",
    longDescription:
      "From wireframes to high-fidelity screens, we design interfaces that feel effortless. Every pixel is intentional, built for clarity, conversion, and delight across web and mobile.",
    image: serviceImages.uiDesign,
    bg: "bg-gray-50",
    deliverables: [
      "User research & personas",
      "Wireframes & user flows",
      "High-fidelity UI screens",
      "Interactive Figma prototype",
      "Design system & components",
    ],
  },
  {
    title: "WEBSITE",
    slug: "website",
    description:
      "Designing and developing stunning websites that convert. Fast, responsive, and built for performance.",
    longDescription:
      "We design and build websites that look premium and perform flawlessly. From landing pages to full multi-page sites on WordPress or Framer, optimized for speed and SEO.",
    image: serviceImages.website,
    bg: "bg-background",
    deliverables: [
      "Custom website design",
      "Responsive development",
      "WordPress or Framer build",
      "SEO-ready structure",
      "Launch & handoff support",
    ],
  },
  {
    title: "MARKETING",
    slug: "marketing",
    description:
      "Creating compelling marketing assets that drive engagement. Social media, ads, and campaigns that perform.",
    longDescription:
      "Design that sells. We create scroll-stopping social creatives, ad banners, email templates, and campaign assets aligned with your brand and goals.",
    image: serviceImages.marketing,
    bg: "bg-gray-50",
    deliverables: [
      "Social media post templates",
      "Paid ad creatives",
      "Email newsletter design",
      "Landing page variants",
      "Campaign visual strategy",
    ],
  },
];

export const whyChooseReasons = [
  {
    icon: "✦",
    title: "DESIGN-FIRST APPROACH",
    description:
      "Every project starts with design. We believe great design drives business results.",
    detail:
      "Strategy and aesthetics work together from day one, not as an afterthought.",
  },
  {
    icon: "◎",
    title: "EXPERT TEAM",
    description:
      "Our team of seasoned designers and developers deliver world-class work.",
    detail:
      "UI designers, brand specialists, and developers collaborate on every project.",
  },
  {
    icon: "◈",
    title: "FAST DELIVERY",
    description:
      "We move quickly without compromising quality. Your timeline is our priority.",
    detail:
      "Clear milestones, weekly updates, and on-time delivery, every single time.",
  },
  {
    icon: "◇",
    title: "DEDICATED SUPPORT",
    description:
      "We stay with you beyond launch. Ongoing support and iteration included.",
    detail:
      "Post-launch tweaks, training, and maintenance packages available when you need them.",
  },
  {
    icon: "◆",
    title: "PROVEN RESULTS",
    description:
      "Our work speaks for itself. Brands we've helped have seen measurable growth.",
    detail:
      "Higher engagement, better conversion, and stronger brand recall for our clients.",
  },
];

export const stats = [
  { value: "120+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "5 Days", label: "Avg. Landing Page" },
  { value: "24/7", label: "WhatsApp Support" },
];

/* ─── Pricing: page-count tabs ─── */
export const pricingTabs = [
  { id: "1-4", label: "1-4 Pages" },
  { id: "5-9", label: "5-9 Pages" },
  { id: "10-15", label: "10-15 Pages" },
  { id: "16-25", label: "16-25 Pages" },
  { id: "enterprise", label: "Enterprise" },
];

/* Package definitions — identical across every page-count tier, only price scales */
const pricingPackageMeta = [
  {
    name: "Launch Package",
    idealFor: "Design only, ideal for founders who need a polished UI before they build.",
    features: [
      "UX research",
      "High-fidelity designs",
      "Responsive Design",
      "Figma Prototype",
      "Design System",
      "Developer Handoff",
      "Unlimited Revisions",
    ],
    highlighted: false,
  },
  {
    name: "Growth Package",
    idealFor: "Design + Development, everything you need to go from concept to a live site.",
    features: [
      "Everything from Launch",
      "Design Documentation",
      "Framer / Webflow / WordPress Development",
      "Hosting & Domain Setup",
      "Analytics Setup",
      "2 Months Maintenance",
    ],
    highlighted: true,
  },
  {
    name: "Signature Package",
    idealFor: "Design + Dev + Branding, a complete digital presence built to scale.",
    features: [
      "Everything from Growth",
      "SEO Setup",
      "3 Months Maintenance",
      "Logo and Essentials",
      "AI Brand Photoshoot",
      "Color Theme Support",
      "Multilingual Support",
    ],
    highlighted: false,
  },
] as const;

/* Base price (USD) per package, per page-count tier — null = custom / contact us */
const pricingTierPrices: Record<string, (number | null)[]> = {
  "1-4": [300, 500, 900],
  "5-9": [600, 800, 999],
  "10-15": [1200, 1400, 1700],
  "16-25": [1600, 1800, 2100],
  enterprise: [null, null, null],
};

export function getPricingPlans(tabId: string) {
  const prices = pricingTierPrices[tabId] ?? pricingTierPrices["1-4"];
  return pricingPackageMeta.map((meta, i) => ({
    ...meta,
    basePrice: prices[i],
  }));
}

/** Package names, used to prefill the contact form's "Selected Package" field. */
export const pricingPackageNames = pricingPackageMeta.map((meta) => meta.name);

export const pricingPlans = getPricingPlans("1-4");

/* ─── Bonuses — free extras bundled with every package ─── */
export const bonuses = [
  {
    icon: "prototype",
    title: "Free Design Prototype",
    description: "Experience your design in action before development.",
  },
  {
    icon: "handoff",
    title: "Developer Handoff",
    description: "We ensure what we design is exactly what gets built.",
  },
  {
    icon: "management",
    title: "Project Management",
    description: "Stay on track with our expert project management.",
  },
  {
    icon: "consultation",
    title: "Project Consultation",
    description: "Get professional advice to enhance your project.",
  },
] as const;

export const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We offer UI/UX design, branding, website design, and digital marketing. From logo creation in Illustrator to live sites on WordPress or Framer, we handle the full creative pipeline.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "A landing page takes about 5 business days. Full websites run 10–14 days. Complete brand identity projects typically take 2–3 weeks depending on scope and feedback rounds.",
  },
  {
    question: "Do you offer revisions?",
    answer:
      "Yes. Basic includes 2 revision rounds, Pro includes unlimited revisions during the project window, and Elite comes with a dedicated designer and extended support.",
  },
  {
    question: "What is your design process?",
    answer:
      "We follow four steps: Logo in Illustrator → Paper wireframe → Figma site design → WordPress/Framer live deployment. You receive updates at every milestone.",
  },
  {
    question: "Which platforms do you build on?",
    answer:
      "We design in Figma and deploy on WordPress, Framer, or provide developer-ready exports. We recommend the best platform based on your budget and maintenance needs.",
  },
  {
    question: "How do I get started?",
    answer:
      "Click Start a Project or message us on WhatsApp. We'll schedule a free discovery call within 24 hours to understand your goals, timeline, and budget.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Absolutely. We work with clients worldwide. All communication happens via WhatsApp, email, and video calls in English or Bengali.",
  },
  {
    question: "What do I need to provide?",
    answer:
      "Share your brand brief, inspiration references, content (text & images), and any existing assets. Don't have everything? We'll help you define it during discovery.",
  },
];

export const contactInfo = {
  email: CONTACT_EMAIL,
  phone: CONTACT_PHONE,
  address: "Dhaka, Bangladesh",
  hours: "Mon – Sat, 10:00 AM – 8:00 PM (BST)",
};
