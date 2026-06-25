"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PixiioLogo from "@/components/PixiioLogo";
import WhatsappButton from "@/components/WhatsappButton";
import { navLinks, socialLinks } from "@/lib/site-config";

/* ─── Nav icon per link ─── */
function NavIcon({ index }: { index: number }) {
  const icons = [
    // Services
    <path key="s" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    // Case Studies
    <path key="c" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    // About Us
    <path key="a" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    // Design Process
    <path key="d" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    // Pricing
    <path key="p" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    // Quick Help
    <path key="q" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    // Contact
    <path key="co" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  ];
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-primary">
      {icons[index] ?? icons[0]}
    </svg>
  );
}

/* ─── Social icon ─── */
function SocialIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
    instagram: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
    linkedin: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />,
    dribbble: <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.128 5.548-3.388 1.174 1.411 1.988 3.131 2.322 5.141zm-3.743-7.157c-1.262 1.137-2.969 2.177-5.088 3.104-1.075-1.742-2.234-3.323-3.454-4.725 2.637-1.027 5.541-.886 8.542 1.621zm-9.522-1.38c1.207 1.381 2.349 2.941 3.408 4.646-2.776.902-5.923 1.386-9.365 1.416.692-2.835 2.601-5.193 5.957-6.062zm-5.99 8.098c3.698-.016 7.075-.537 10.038-1.522.231.475.447.961.65 1.453-3.773 1.348-6.867 3.759-9.124 7.042-2.512-2.061-4.012-5.104-4.012-8.393 0-.208.005-.415.014-.621.434.006.868.021 1.434.041zm6.099 9.462c1.911-3.308 4.482-5.657 7.598-6.912.998 2.533 1.523 5.236 1.568 8.032-3.253.666-6.517-.189-9.166-1.12zm11.878 1.082c-.047-2.558-.521-5.077-1.415-7.472 1.753-.448 3.772-.688 6.033-.688.412 2.469-.362 5.012-2.337 7.012-1.058-.286-2.084-.584-3.081-.852z" />,
    behance: <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.987h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.08h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />,
    twitter: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    whatsapp: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {icons[icon] ?? null}
    </svg>
  );
}

/* ─── Right panel showcase images ─── */
const showcaseImages = [
  { src: "/image-01.jpg", label: "FINTECH" },
  { src: "/image-07.jpg", label: "WEB DESIGN" },
  { src: "/image-05.jpg", label: "HEALTH" },
  { src: "/image-03.jpg", label: "SAAS" },
];

/* ─── Right panel ─── */
function RightPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="hidden lg:flex flex-col h-full bg-surface-muted rounded-2xl p-6 overflow-hidden">
      {/* Header text */}
      <div className="mb-4 shrink-0">
        <p className="text-[11px] font-bold tracking-[0.18em] text-primary uppercase mb-1">
          WE CREATE EXPERIENCES
        </p>
        <h2 className="font-display text-[2.6rem] leading-[0.95] tracking-wide text-navy">
          We design brands that
          <br />
          <span className="text-primary">lead &amp; inspire.</span>
        </h2>
      </div>

      {/* Trusted badge */}
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <Image src={`/image-0${i}.jpg`} alt={`Client ${i}`} width={32} height={32} className="object-cover w-full h-full" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-[9px] font-bold">
            +10
          </div>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-navy">Since 2025</p>
          <p className="text-[11px] text-gray-500">Trusted by 10+ successful clients worldwide.</p>
        </div>
      </div>

      {/* 2×2 image grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        {showcaseImages.map((img, i) => (
          <div key={i} className="relative rounded-xl overflow-hidden group/card">
            <Image
              src={img.src}
              alt={img.label}
              fill
              className="object-cover transition-transform duration-500 group-hover/card:scale-105"
              sizes="(max-width: 1280px) 25vw, 300px"
            />
            {/* Tag top-left */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-surface-elevated/90 backdrop-blur-sm text-navy text-[10px] font-bold tracking-[0.12em] px-2.5 py-1 rounded-full">
                {img.label}
              </span>
            </div>
            {/* Arrow bottom-right — link with hover: bg becomes primary, icon turns white */}
            <Link
              href="/work"
              onClick={onClose}
              className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-surface-elevated hover:bg-primary flex items-center justify-center text-navy hover:text-white transition-all duration-200 shadow-sm"
              aria-label={`View ${img.label} project`}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 13L13 3M13 3H7M13 3V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div className="mt-4 shrink-0 bg-surface-elevated rounded-xl px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-primary text-xl">✦</span>
          <div>
            <p className="text-sm font-bold text-navy">Have a project in mind?</p>
            <p className="text-xs text-gray-500">We&apos;re ready to turn your ideas into reality.</p>
          </div>
        </div>
        <Link
          href="/contact"
          onClick={onClose}
          className="group inline-flex items-center gap-2 bg-primary text-white text-[11px] font-bold tracking-[0.1em] uppercase pl-4 pr-2 py-2 rounded-full hover:bg-primary-dark transition-colors shrink-0 overflow-hidden"
        >
          LET&apos;S WORK TOGETHER
          <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white shrink-0 overflow-hidden">
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function OffcanvasMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  const overlay = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] bg-black/50 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Full-screen panel — bg covers viewport, content constrained to page width */}
      <nav
        className={`fixed inset-0 z-[201] h-dvh max-h-dvh overflow-hidden bg-background/80 backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-y-0 visible" : "-translate-y-full pointer-events-none invisible"
        }`}
        aria-label="Main menu"
        aria-modal="true"
        role="dialog"
      >
        {/* Constrained content — matches page max-w-7xl + px-6 */}
        <div className="h-full max-w-7xl mx-auto px-6 flex flex-col min-h-0 overflow-hidden">

          {/* Top bar — logo left, close button exactly where menu button sits (right edge) */}
          <div className="flex items-center justify-between py-3.5 shrink-0">
            <Link href="/" onClick={close} aria-label="Pixiio home">
              <PixiioLogo className="h-7 w-auto" />
            </Link>
            {/* Close button — same size/position as the menu trigger */}
            <button
              type="button"
              onClick={close}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-solid hover:bg-primary transition-colors shrink-0 group overflow-hidden"
              aria-label="Close menu"
            >
              {/* Animated ✕ — slides out right, re-enters from left on hover */}
              <span className="relative flex items-center justify-center w-full h-full">
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </button>
          </div>

          {/* Two-column body */}
          <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[440px_1fr] gap-0 bg-surface-elevated rounded-2xl overflow-hidden border border-gray-100 shadow-xl mb-0 lg:mb-4">

          {/* ── LEFT: Nav + social ── */}
          <div className="flex-1 min-h-0 flex flex-col px-6 pt-5 pb-5 lg:h-full border-r-0 lg:border-r border-gray-100">
            {/* NAVIGATION label — single instance */}
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 mb-3 shrink-0">NAVIGATION</p>

            {/* Nav links */}
            <ul className="flex flex-col flex-1 min-h-0 justify-between">
              {navLinks.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="group flex items-center gap-4 py-2 border-b border-gray-100"
                  >
                    {/* Number */}
                    <span className="text-[11px] font-bold text-gray-300 w-5 shrink-0 group-hover:text-primary transition-colors duration-200">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Icon box — desktop only */}
                    <span className="hidden lg:flex w-9 h-9 rounded-lg bg-surface-muted items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                      <NavIcon index={i} />
                    </span>
                    {/* Text — slides out left, re-enters from right — slowed down */}
                    <span className="flex-1 min-w-0 overflow-hidden">
                      <span className="relative flex">
                        <span className="block font-display text-2xl lg:text-4xl leading-tight tracking-wide text-navy group-hover:text-primary transition-all duration-500 ease-in-out group-hover:-translate-x-full group-hover:opacity-0">
                          {link.label.toUpperCase()}
                        </span>
                        <span className="absolute inset-0 block font-display text-2xl lg:text-4xl leading-tight tracking-wide text-primary translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
                          {link.label.toUpperCase()}
                        </span>
                      </span>
                    </span>
                    {/* Arrow */}
                    <span className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social — mt-4 provides the visual gap, no extra border needed */}
            <div className="shrink-0 mt-4 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 mb-3">FOLLOW US</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors duration-200 overflow-hidden"
                  >
                    <SocialIcon icon={social.icon} />
                    {/* Text slides — slowed down */}
                    <span className="relative overflow-hidden" style={{ minWidth: `${social.label.length * 6.5}px` }}>
                      <span className="block transition-all duration-500 ease-in-out group-hover:-translate-x-full group-hover:opacity-0">
                        {social.label}
                      </span>
                      <span className="absolute inset-0 translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
                        {social.label}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Showcase panel — desktop only ── */}
          <div className="hidden lg:block h-full min-h-0 p-5 overflow-hidden">
            <RightPanel onClose={close} />
          </div>

          </div>{/* end two-column grid */}
        </div>{/* end constrained content */}
      </nav>
    </>
  );

  return (
    <>
      {/* Trigger button — animated icon slides out right, re-enters from left */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-solid hover:bg-primary transition-colors shrink-0 group overflow-hidden dark:border dark:border-border-subtle"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <span className="relative flex items-center justify-center w-full h-full">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
            <Image src="/menu.svg" alt="" width={20} height={20} className="w-5 h-5 brightness-0 invert" />
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
            <Image src="/menu.svg" alt="" width={20} height={20} className="w-5 h-5 brightness-0 invert" />
          </span>
        </span>
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
