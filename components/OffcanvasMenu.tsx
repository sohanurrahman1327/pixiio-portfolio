"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import WhatsappButton from "@/components/WhatsappButton";
import { navLinks, socialLinks } from "@/lib/site-config";

function SocialIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    ),
    linkedin: (
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    ),
    dribbble: (
      <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.128 5.548-3.388 1.174 1.411 1.988 3.131 2.322 5.141zm-3.743-7.157c-1.262 1.137-2.969 2.177-5.088 3.104-1.075-1.742-2.234-3.323-3.454-4.725 2.637-1.027 5.541-.886 8.542 1.621zm-9.522-1.38c1.207 1.381 2.349 2.941 3.408 4.646-2.776.902-5.923 1.386-9.365 1.416.692-2.835 2.601-5.193 5.957-6.062zm-5.99 8.098c3.698-.016 7.075-.537 10.038-1.522.231.475.447.961.65 1.453-3.773 1.348-6.867 3.759-9.124 7.042-2.512-2.061-4.012-5.104-4.012-8.393 0-.208.005-.415.014-.621.434.006.868.021 1.434.041zm6.099 9.462c1.911-3.308 4.482-5.657 7.598-6.912.998 2.533 1.523 5.236 1.568 8.032-3.253.666-6.517-.189-9.166-1.12zm11.878 1.082c-.047-2.558-.521-5.077-1.415-7.472 1.753-.448 3.772-.688 6.033-.688.412 2.469-.362 5.012-2.337 7.012-1.058-.286-2.084-.584-3.081-.852z" />
    ),
    behance: (
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.987h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.08h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
    ),
    twitter: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  };

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {icons[icon]}
    </svg>
  );
}

export default function OffcanvasMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-[#0f1a3d] hover:opacity-70 transition-opacity"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z"
            fill="#0f1a3d"
          />
        </svg>
        MENU
      </button>

      <div
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden={!open}
      />

      <nav
        className={`fixed inset-x-0 top-0 z-[101] bg-white shadow-2xl max-h-[100dvh] overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        aria-hidden={!open}
      >
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-10">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" onClick={close}>
              <Image
                src="/pixiio-logo.svg"
                alt="pixiio design agency"
                width={119}
                height={37}
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={close}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Close menu"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="border-b border-gray-100 pb-8 mb-8">
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 mb-4">
              FOLLOW US
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
                >
                  <SocialIcon icon={social.icon} />
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          <ul className="space-y-1 mb-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="group flex items-center justify-between py-4 border-b border-gray-50"
                >
                  <span className="font-display text-3xl md:text-4xl tracking-wide text-gray-900 group-hover:text-primary transition-colors">
                    {link.label.toUpperCase()}
                  </span>
                  <span className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <WhatsappButton className="w-full justify-center py-3" />
        </div>
      </nav>
    </>
  );
}
