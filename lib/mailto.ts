import { CONTACT_EMAIL } from "@/lib/site-config";

export interface MailtoOptions {
  to?: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

/** Build a mailto: URL with optional subject, body, cc, bcc. */
export function buildMailtoUrl({
  to = CONTACT_EMAIL,
  subject,
  body,
  cc,
  bcc,
}: MailtoOptions = {}): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  if (cc) params.set("cc", cc);
  if (bcc) params.set("bcc", bcc);
  const qs = params.toString();
  return qs ? `mailto:${to}?${qs}` : `mailto:${to}`;
}

/** Open the user's default mail client (client-side only). */
export function openMailto(options: MailtoOptions = {}): void {
  window.location.href = buildMailtoUrl(options);
}

/* ── Pre-built templates for common click targets ── */

export const mailtoLinks = {
  /** Footer, contact page, privacy/terms — plain address click */
  general: () => buildMailtoUrl(),

  /** FAQ "Prefer email?" card */
  faq: () =>
    buildMailtoUrl({
      subject: "Question from Pixiio FAQ",
      body: "Hi Pixiio Team,\n\nI have a question:\n\n",
    }),

  /** Contact page email link */
  contact: () =>
    buildMailtoUrl({
      subject: "Contact from Pixiio Website",
      body: "Hi Pixiio Team,\n\nI'd like to get in touch about:\n\n",
    }),

  /** Privacy / terms inquiry */
  legal: () =>
    buildMailtoUrl({
      subject: "Legal Inquiry — Pixiio Website",
      body: "Hi Pixiio Team,\n\nI have a question regarding your policies:\n\n",
    }),
};

/** Contact form — pre-fill subject & body from form fields */
export function mailtoContactInquiry(data: {
  name: string;
  email: string;
  project: string;
  budget: string;
  message: string;
}): string {
  return buildMailtoUrl({
    subject: `New Project Inquiry from ${data.name}`,
    body: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Project: ${data.project}`,
      `Budget: ${data.budget}`,
      "",
      "Message:",
      data.message,
    ].join("\n"),
  });
}

/** Newsletter signup — pre-fill subscription request */
export function mailtoNewsletterSubscription(email: string): string {
  return buildMailtoUrl({
    subject: "Newsletter Subscription",
    body: `Please subscribe me: ${email}`,
  });
}

/** Booking form fallback when API is unavailable */
export function mailtoBookingRequest(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  notes: string;
  date: string;
  slot: string;
  timezone: string;
  guests: string[];
  meetLink?: string;
}): string {
  const guestList = data.guests.length > 0 ? data.guests.join(", ") : "None";
  return buildMailtoUrl({
    subject: `Booking Request — ${data.name} · ${data.service}`,
    body: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Service: ${data.service}`,
      `Date: ${data.date}`,
      `Time: ${data.slot} (${data.timezone})`,
      `Guests: ${guestList}`,
      data.meetLink ? `Google Meet: ${data.meetLink}` : "",
      data.notes ? `\nNotes:\n${data.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
