import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import BootPreloader from "@/components/BootPreloader";
import { BookingProvider } from "@/lib/booking-context";
import { ThemeProvider } from "@/lib/theme-context";
import BookingModal from "@/components/BookingModal";
import WhatsAppLiveChat from "@/components/WhatsAppLiveChat";
import { BOOT_PRELOADER_SCRIPT, BOOT_PRELOADER_STYLES } from "@/lib/boot-preloader";
import { getSiteUrl } from "@/lib/site-url";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Pixiio — Design-Led Creative Agency",
  description:
    "We help build up brands with UI design, branding, website design, and marketing.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} min-h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: BOOT_PRELOADER_STYLES }} />
        <script dangerouslySetInnerHTML={{ __html: BOOT_PRELOADER_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip bg-background text-foreground">
        <BootPreloader />
        <ThemeProvider>
          <BookingProvider>
            <BookingModal />
            <WhatsAppLiveChat />
            <SmoothScroll />
            <div
              id="page-content"
              className="flex flex-col flex-1 min-w-0 overflow-x-clip"
            >
              {children}
            </div>
          </BookingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
