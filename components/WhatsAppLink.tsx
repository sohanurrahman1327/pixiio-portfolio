"use client";

import type { ReactNode } from "react";

type WhatsAppLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

/**
 * Renders WhatsApp click-to-chat CTAs as a real `<button>` instead of an
 * `<a href>`. wa.me rate-limits repeated automated requests with HTTP 429,
 * which SEO crawlers (Semrush, Ahrefs, etc.) then flag as a "broken link"
 * even though the link works fine for real visitors. Since there's no
 * static href for crawlers to discover and re-check, the link never shows
 * up in a site audit — navigation still happens via JS on click.
 */
export default function WhatsAppLink({ href, className = "", children, onClick }: WhatsAppLinkProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.open(href, "_blank", "noopener,noreferrer");
        onClick?.();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
