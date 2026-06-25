export const WHATSAPP_NUMBER = "8801346064215";
export const WHATSAPP_MESSAGE =
  "Hi Pixiio! I'd like to start a new design project.";

export const CONTACT_EMAIL = "agency.pixiio@gmail.com";
export const CONTACT_PHONE = "+8801346-064215";

/** Permanent Google Meet room — set in .env.local as NEXT_PUBLIC_GOOGLE_MEET_LINK */
export const GOOGLE_MEET_LINK =
  process.env.NEXT_PUBLIC_GOOGLE_MEET_LINK ?? "";

export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Library", href: "/library/components" },
  { label: "Featured Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Design Process", href: "/process" },
  { label: "Why Choose Us", href: "/why-us" },
  { label: "Pricing", href: "/pricing" },
  { label: "Quick Help", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/agency.pixiio",
    icon: "facebook",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/pixiio",
    icon: "instagram",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/pixiio",
    icon: "linkedin",
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/agency-pixiio",
    icon: "dribbble",
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    icon: "whatsapp",
  },
  {
    label: "Behance",
    href: "https://behance.net/pixiio",
    icon: "behance",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/pixiio",
    icon: "twitter",
  },
];
