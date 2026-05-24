import Link from "next/link";
import { navLinks } from "@/lib/site-config";

const footerLinks = {
  Services: [
    { label: "UI Design", href: "/services" },
    { label: "Branding", href: "/services" },
    { label: "Website", href: "/services" },
    { label: "Marketing", href: "/services" },
  ],
  Company: navLinks.filter((l) =>
    ["Featured Work", "Design Process", "Why Choose Us", "Contact"].includes(
      l.label,
    ),
  ),
  Pages: navLinks.filter((l) =>
    ["Pricing", "Quick Help"].includes(l.label),
  ),
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <section>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide mb-6 leading-tight">
              LET&apos;S BUILD
              <br />
              SOMETHING GREAT.
            </h2>
            <Link
              href="/contact"
              className="text-xs font-semibold tracking-wider text-gray-900 flex items-center gap-1 hover:gap-2 transition-all w-fit"
            >
              START A PROJECT <span>→</span>
            </Link>
          </section>

          <div className="grid grid-cols-3 gap-8">
            <nav>
              <h3 className="text-xs font-semibold tracking-wider text-gray-900 mb-4">
                SERVICES
              </h3>
              <ul className="space-y-2">
                {footerLinks.Services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav>
              <h3 className="text-xs font-semibold tracking-wider text-gray-900 mb-4">
                COMPANY
              </h3>
              <ul className="space-y-2">
                {footerLinks.Company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav>
              <h3 className="text-xs font-semibold tracking-wider text-gray-900 mb-4">
                MORE
              </h3>
              <ul className="space-y-2">
                {footerLinks.Pages.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <hr className="border-gray-100 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 Pixiio Design Agency. All rights reserved.</p>
          <nav className="flex gap-6">
            <Link href="/faq" className="hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
