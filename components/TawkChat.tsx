"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useBooking } from "@/lib/booking-context";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      [key: string]: unknown;
    };
    Tawk_LoadStart?: Date;
  }
}

const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

export default function TawkChat() {
  const { isOpen: bookingOpen } = useBooking();

  useEffect(() => {
    const widget = window.Tawk_API;
    if (!widget) return;
    if (bookingOpen) {
      widget.hideWidget?.();
    } else {
      widget.showWidget?.();
    }
  }, [bookingOpen]);

  if (!TAWK_PROPERTY_ID || !TAWK_WIDGET_ID) return null;

  return (
    <Script
      id="tawk-to-widget"
      strategy="afterInteractive"
      src={`https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`}
      crossOrigin="anonymous"
    />
  );
}
