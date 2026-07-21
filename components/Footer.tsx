"use client";

import Link from "next/link";
import { useState } from "react";
import PixiioLogo from "@/components/PixiioLogo";
import WhatsAppLink from "@/components/WhatsAppLink";
import { navLinks, CONTACT_EMAIL, CONTACT_PHONE, socialLinks } from "@/lib/site-config";
import { mailtoLinks, mailtoNewsletterSubscription } from "@/lib/mailto";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/* ── Icons ─────────────────────────────────────────────────────────── */
function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function DribbbleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
    </svg>
  );
}

const socialIconMap: Record<string, React.ReactNode> = {
  facebook:  <FacebookIcon />,
  linkedin:  <LinkedinIcon />,
  twitter:   <TwitterIcon />,
  instagram: <InstagramIcon />,
  dribbble:  <DribbbleIcon />,
};

const footerSocialKeys = ["facebook", "instagram", "linkedin", "dribbble", "twitter"];

const mainLinks = navLinks.map((l) => ({ label: l.label, href: l.href }));

/* ── Subscribe success ──────────────────────────────────────────────── */
function SubscribeSuccess() {
  return (
    <div className="flex items-center gap-3 pt-1">
      {/* Animated circle + checkmark */}
      <div className="animate-circle-pop shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline
            points="4 12 9 17 20 7"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-checkmark"
          />
        </svg>
      </div>
      {/* Text to the right of the icon */}
      <p className="animate-fade-up text-sm font-medium text-gray-900">
        You&apos;re subscribed!
      </p>
    </div>
  );
}

/* ── Component ──────────────────────────────────────────────────────── */
export default function Footer() {
  const [email, setEmail]           = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setEmailError("Only @gmail.com addresses are accepted.");
      return;
    }
    setEmailError("");
    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSubscribed(true);
        return;
      }

      if (data.fallback === "mailto") {
        window.location.href = mailtoNewsletterSubscription(email);
        return;
      }

      setSubmitError(data.error || "Could not subscribe. Please try again.");
    } catch {
      window.location.href = mailtoNewsletterSubscription(email);
    } finally {
      setSubmitting(false);
    }
  }

  // All 7 nav links — col1: first 4, col2: last 3
  const col1 = mainLinks.slice(0, 4);
  const col2 = mainLinks.slice(4);

  const footerSocials = footerSocialKeys
    .map((key) => socialLinks.find((s) => s.icon === key))
    .filter(Boolean) as typeof socialLinks;

  return (
    <footer className="bg-surface-elevated border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">

          {/* Col 1 — Newsletter */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              Stay connected
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Join our newsletter for tips, updates, and project highlights, only the good stuff.
            </p>

            {subscribed ? (
              <SubscribeSuccess />
            ) : (
              <>
                <form onSubmit={handleNewsletter} className="flex items-stretch gap-2">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); setSubmitError(""); }}
                    placeholder="Enter email address*"
                    required
                    disabled={submitting}
                    className={`flex-1 h-11 bg-gray-50 dark:bg-surface-elevated border rounded-lg px-4 text-sm text-gray-900 dark:text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary transition-colors disabled:opacity-60 ${emailError ? "border-red-400" : "border-gray-200 dark:border-border-subtle"}`}
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    disabled={submitting}
                    className="h-11 w-11 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shrink-0 disabled:opacity-60"
                  >
                    {submitting ? (
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </form>
                {emailError && (
                  <p className="text-red-500 text-xs mt-2">{emailError}</p>
                )}
                {submitError && (
                  <p className="text-red-500 text-xs mt-2">{submitError}</p>
                )}
              </>
            )}
          </div>

          {/* Col 2 — Main Links */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-widest text-gray-400 mb-5 uppercase">
              Main links
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {/* col1: Services, Featured Work, Design Process, Why Choose Us */}
              <ul className="space-y-3">
                {col1.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-sm font-medium text-gray-900"
                    >
                      <span className="relative overflow-hidden" style={{ display: "inline-block" }}>
                        <span className="block transition-all duration-500 ease-in-out group-hover:-translate-x-full group-hover:opacity-0">
                          {link.label}
                        </span>
                        <span className="absolute inset-0 text-primary translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
                          {link.label}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {/* col2: Pricing, Quick Help, Contact */}
              <ul className="space-y-3">
                {col2.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-sm font-medium text-gray-900"
                    >
                      <span className="relative overflow-hidden" style={{ display: "inline-block" }}>
                        <span className="block transition-all duration-500 ease-in-out group-hover:-translate-x-full group-hover:opacity-0">
                          {link.label}
                        </span>
                        <span className="absolute inset-0 text-primary translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
                          {link.label}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3 — Get in touch */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-widest text-gray-400 mb-5 uppercase">
              Get in touch
            </h3>
            <WhatsAppLink
              href={buildWhatsAppUrl()}
              className="block text-base font-bold text-gray-900 hover:text-[#25D366] transition-colors mb-1 text-left"
            >
              {CONTACT_PHONE}
            </WhatsAppLink>
            <a
              href={mailtoLinks.general()}
              className="block text-base font-bold text-primary hover:text-primary-dark transition-colors mb-8"
            >
              {CONTACT_EMAIL}
            </a>

            <h3 className="text-[10px] font-semibold tracking-widest text-gray-400 mb-3 uppercase">
              Offline
            </h3>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              PIXIIO{" "}
              <span className="text-[10px] font-light tracking-widest text-gray-400 lowercase">
                .agency
              </span>
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">Dhaka, Bangladesh</p>
          </div>
        </div>

        {/* ── Social list + Brand name ── */}
        {/*
          Social list is vertically centered relative to the PIXIIO text block.
          We use items-center so both sides align to the middle of the row.
        */}
        <div className="border-t border-gray-100 pt-8 mb-10 flex flex-col lg:flex-row lg:items-center gap-8">

          {/* Social list — fixed width, self-contained */}
          <div className="w-full lg:w-72 shrink-0 self-center">
            <ul className="divide-y divide-gray-100">
              {footerSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-3 group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-primary group-hover:text-white">
                        {socialIconMap[social.icon]}
                      </span>
                      <span className="relative overflow-hidden" style={{ display: "inline-block" }}>
                        <span className="block text-sm text-gray-600 transition-all duration-500 ease-in-out group-hover:-translate-x-full group-hover:opacity-0">
                          {social.label}
                        </span>
                        <span className="absolute inset-0 text-sm font-medium text-primary translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
                          {social.label}
                        </span>
                      </span>
                    </span>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 ease-out"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand logo — same mark as navbar, scaled for footer */}
          <div className="relative w-full lg:flex-1 lg:min-w-0 flex justify-center">
            <Link
              href="/"
              aria-label="Pixiio home"
              className="inline-flex max-w-full"
            >
              <PixiioLogo className="w-[clamp(14rem,52vw,38rem)] h-auto select-none" />
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>©2026 Pixiio. All rights reserved.</p>
          <nav className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="group relative inline-block hover:text-gray-900 transition-colors"
            >
              <span className="relative overflow-hidden" style={{ display: "inline-block" }}>
                <span className="block transition-all duration-500 ease-in-out group-hover:-translate-x-full group-hover:opacity-0">
                  Privacy Policy
                </span>
                <span className="absolute inset-0 text-gray-900 translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
                  Privacy Policy
                </span>
              </span>
            </Link>
            <span className="text-gray-200">·</span>
            <Link
              href="/terms"
              className="group relative inline-block hover:text-gray-900 transition-colors"
            >
              <span className="relative overflow-hidden" style={{ display: "inline-block" }}>
                <span className="block transition-all duration-500 ease-in-out group-hover:-translate-x-full group-hover:opacity-0">
                  Terms &amp; Conditions
                </span>
                <span className="absolute inset-0 text-gray-900 translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
                  Terms &amp; Conditions
                </span>
              </span>
            </Link>
          </nav>
        </div>

      </div>
    </footer>
  );
}
