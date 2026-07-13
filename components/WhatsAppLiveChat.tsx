"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBooking } from "@/lib/booking-context";
import { whatsappLinks } from "@/lib/whatsapp";

function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppLiveChat() {
  const { isOpen: bookingOpen } = useBooking();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("pixiio-wa-chat-seen")) return;
    const timer = window.setTimeout(() => {
      setTeaser(true);
      sessionStorage.setItem("pixiio-wa-chat-seen", "1");
    }, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) setTeaser(false);
  }, [open]);

  if (bookingOpen) return null;

  const chatHref = whatsappLinks.support();

  return (
    <div
      className="fixed bottom-5 right-4 z-[48] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
      aria-live="polite"
    >
      {open && (
        <div
          className="w-[min(100vw-2rem,320px)] origin-bottom-right animate-[wa-chat-in_0.28s_ease-out] rounded-2xl border border-gray-100 bg-surface-elevated shadow-2xl shadow-black/10 dark:border-border-subtle dark:shadow-black/40"
          role="dialog"
          aria-label="WhatsApp live chat"
        >
          <div className="flex items-center gap-3 rounded-t-2xl bg-[#075E54] px-4 py-3.5">
            <div className="relative shrink-0">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                <Image
                  src="/pixiio-logo.svg"
                  alt="Pixiio"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075E54] bg-[#25D366]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">Pixiio Support</p>
              <p className="text-xs text-white/75">Typically replies in an hour</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 bg-[#ECE5DD] px-4 py-4 dark:bg-surface-muted">
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-gray-800 shadow-sm dark:bg-surface-elevated dark:text-foreground">
              Hi there 👋 How can we help you today?
            </div>
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-gray-800 shadow-sm dark:bg-surface-elevated dark:text-foreground">
              Ask about pricing, timelines, or start a new project — we&apos;re on WhatsApp.
            </div>
          </div>

          <div className="border-t border-gray-100 px-4 py-3 dark:border-border-subtle">
            <Link
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </Link>
          </div>
        </div>
      )}

      {!open && teaser && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="max-w-[220px] animate-[wa-teaser-in_0.35s_ease-out] rounded-2xl rounded-br-sm border border-gray-100 bg-surface-elevated px-4 py-3 text-left text-sm text-gray-700 shadow-lg transition-colors hover:border-primary/20 dark:border-border-subtle dark:text-foreground"
        >
          <span className="font-semibold text-gray-900 dark:text-foreground">Need help?</span>
          <span className="mt-0.5 block text-xs text-gray-500">Chat with us on WhatsApp</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 hover:bg-[#1fb855] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp live chat"}
        aria-expanded={open}
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 motion-reduce:animate-none" aria-hidden="true" />
        <span className="relative flex items-center justify-center">
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <WhatsAppIcon className="h-7 w-7" />
          )}
        </span>
      </button>
    </div>
  );
}
