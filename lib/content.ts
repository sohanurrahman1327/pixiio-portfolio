import { serviceImages } from "@/lib/images";

export const services = [
  {
    title: "UI DESIGN",
    slug: "ui-design",
    description:
      "Crafting intuitive, beautiful interfaces that users love. We turn complex ideas into seamless digital experiences.",
    longDescription:
      "From wireframes to high-fidelity screens, we design interfaces that feel effortless. Every pixel is intentional — built for clarity, conversion, and delight across web and mobile.",
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
    title: "BRANDING",
    slug: "branding",
    description:
      "Building memorable brand identities that stand out. From logos to full brand guidelines, we define who you are.",
    longDescription:
      "Your brand is more than a logo. We craft cohesive visual identities — color, typography, voice, and assets — that make your business instantly recognizable and trusted.",
    image: serviceImages.branding,
    bg: "bg-white",
    deliverables: [
      "Logo design (Illustrator)",
      "Color palette & typography",
      "Brand guidelines PDF",
      "Business card & stationery",
      "Social media brand kit",
    ],
  },
  {
    title: "WEBSITE",
    slug: "website",
    description:
      "Designing and developing stunning websites that convert. Fast, responsive, and built for performance.",
    longDescription:
      "We design and build websites that look premium and perform flawlessly. From landing pages to full multi-page sites on WordPress or Framer — optimized for speed and SEO.",
    image: serviceImages.website,
    bg: "bg-white",
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
      "Strategy and aesthetics work together from day one — not as an afterthought.",
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
      "Clear milestones, weekly updates, and on-time delivery — every single time.",
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

export const pricingPlans = [
  {
    name: "BASIC",
    price: "$200",
    idealFor: "Startups & solo founders",
    features: [
      "Landing Page Design",
      "Mobile Responsive",
      "2 Revisions",
      "5 Day Delivery",
      "Figma source files",
    ],
    highlighted: false,
  },
  {
    name: "PRO",
    price: "$500",
    idealFor: "Growing brands & SMBs",
    features: [
      "Full Website Design",
      "Brand Guidelines",
      "Unlimited Revisions",
      "UI/UX Prototype",
      "10 Day Delivery",
      "WordPress or Framer ready",
    ],
    highlighted: true,
  },
  {
    name: "ELITE",
    price: "$1000",
    idealFor: "Agencies & enterprises",
    features: [
      "Complete Brand Identity",
      "Website + Marketing Assets",
      "Priority Support",
      "Dedicated Designer",
      "Custom Timeline",
      "3 months post-launch support",
    ],
    highlighted: false,
  },
];

export const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We offer UI/UX design, branding, website design, and digital marketing. From logo creation in Illustrator to live sites on WordPress or Framer — we handle the full creative pipeline.",
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
  email: "hello@pixiio.design",
  phone: "+880 1712 345678",
  address: "Dhaka, Bangladesh",
  hours: "Mon – Sat, 10:00 AM – 8:00 PM (BST)",
};
