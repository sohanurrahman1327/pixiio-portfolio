import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "@/lib/site-config";

export interface WhatsAppOptions {
  message?: string;
}

/** Build a wa.me link that opens WhatsApp chat with the business number. */
export function buildWhatsAppUrl({ message = WHATSAPP_MESSAGE }: WhatsAppOptions = {}): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Pre-built links for common click targets across the site. */
export const whatsappLinks = {
  /** Default — start a new project */
  general: () => buildWhatsAppUrl(),

  /** FAQ / support card */
  support: () =>
    buildWhatsAppUrl({ message: "Hi Pixiio! I have a question and need some help." }),

  /** Footer / contact page phone number click */
  phone: () => buildWhatsAppUrl({ message: "Hi Pixiio! I'd like to get in touch." }),
};
