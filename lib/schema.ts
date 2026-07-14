import { CONTACT_EMAIL, CONTACT_PHONE, socialLinks } from "./site-config";
import { getSiteUrl } from "./site-url";
import { SITE_DESCRIPTION, SITE_NAME } from "./seo";

const SITE_URL = getSiteUrl();

/** JSON-LD `sameAs` should only list durable public profiles, not click-to-chat links. */
const PROFILE_LINKS = socialLinks
  .filter((link) => link.icon !== "whatsapp")
  .map((link) => link.href);

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/pixiio-logo-with-text.svg`,
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    sameAs: PROFILE_LINKS,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        availableLanguage: ["English", "Bengali"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function serviceSchema(service: {
  title: string;
  description: string;
  slug: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}`,
    image: service.image ? `${SITE_URL}${service.image}` : undefined,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "Worldwide",
  };
}

export function articleSchema(post: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  publishedAt: string;
  authorName: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [`${SITE_URL}${post.coverImage}`],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.authorName,
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    keywords: post.tags.join(", "),
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Serializes a JSON-LD object for a `<script type="application/ld+json">` tag. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data) };
}
