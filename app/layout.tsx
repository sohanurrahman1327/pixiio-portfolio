import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import { BookingProvider } from "@/lib/booking-context";
import { ThemeProvider } from "@/lib/theme-context";
import BookingModal from "@/components/BookingModal";
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("pixiio-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark"}function reveal(){document.documentElement.classList.remove("preloader-pending");document.documentElement.classList.add("preloader-skipped")}function isSharedPreview(){var h=location.hostname;return h!=="localhost"&&h!=="127.0.0.1"&&h!=="[::1]"}if(isSharedPreview()||sessionStorage.getItem("pixiio-preloader-seen")){reveal()}else{document.documentElement.classList.add("preloader-pending");setTimeout(function(){if(document.documentElement.classList.contains("preloader-pending")){reveal();try{sessionStorage.setItem("pixiio-preloader-seen","1")}catch(e){}}},12000)}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip bg-background text-foreground">
        <ThemeProvider>
          <BookingProvider>
            <BookingModal />
            <SmoothScroll />
            <Preloader />
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
