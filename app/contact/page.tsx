import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import ContactForm from "@/components/ContactForm";
import WhatsappButton from "@/components/WhatsappButton";
import { contactInfo } from "@/lib/content";
import { mailtoLinks } from "@/lib/mailto";
import { whatsappLinks } from "@/lib/whatsapp";
import { socialLinks } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact — Pixiio Design Agency",
  description:
    "Get in touch with Pixiio to start your next UI, branding, or website design project.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        label="GET IN TOUCH"
        title="CONTACT"
        description="Tell us about your project and we'll respond within 24 hours. Prefer instant chat? Message us on WhatsApp anytime."
      />

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-3xl text-gray-900 tracking-wide mb-8">
                SEND A MESSAGE
              </h2>
              <ContactForm />
            </div>

            <aside className="space-y-8">
              <div>
                <h2 className="font-display text-3xl text-gray-900 tracking-wide mb-6">
                  CONTACT INFO
                </h2>
                <ul className="space-y-5">
                  <li>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-1">
                      EMAIL
                    </p>
                    <a
                      href={mailtoLinks.contact()}
                      className="text-sm text-gray-900 hover:text-primary transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </li>
                  <li>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-1">
                      PHONE / WHATSAPP
                    </p>
                    <a
                      href={whatsappLinks.phone()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-900 hover:text-[#25D366] transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </li>
                  <li>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-1">
                      LOCATION
                    </p>
                    <p className="text-sm text-gray-900">{contactInfo.address}</p>
                  </li>
                  <li>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-1">
                      WORKING HOURS
                    </p>
                    <p className="text-sm text-gray-900">{contactInfo.hours}</p>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-4">
                  FOLLOW US
                </p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-colors"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-8">
                <h3 className="font-display text-2xl text-gray-900 tracking-wide mb-3">
                  PREFER WHATSAPP?
                </h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Skip the form — chat with us directly. We&apos;re online Mon–Sat
                  and happy to discuss your project in real time.
                </p>
                <WhatsappButton />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
