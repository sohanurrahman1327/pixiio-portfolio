"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OffcanvasMenu from "@/components/OffcanvasMenu";

const headerNavLinks = [
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/work" },
  { label: "About Us", href: "/why-us" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#eef0fb]/95 backdrop-blur-md border-b border-[#d8dcf5]">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/pixiio-logo.svg"
            alt="pixiio design agency"
            width={110}
            height={34}
            priority
            className="h-7 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
          {headerNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-200 overflow-hidden ${
                  isActive ? "text-[#0f1a3d]" : "text-gray-500"
                }`}
              >
                {/* Star icon — visible when active or on hover */}
                <span
                  className={`shrink-0 transition-all duration-200 overflow-hidden ${
                    isActive ? "w-3 opacity-100" : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-100"
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M6 0.5L7.2 4.3L11 6L7.2 7.7L6 11.5L4.8 7.7L1 6L4.8 4.3L6 0.5Z" fill="#5b5fef" />
                  </svg>
                </span>
                {/* Text slide animation */}
                <span className="relative overflow-hidden" style={{ display: "inline-block" }}>
                  <span className={`block transition-all duration-500 ease-in-out ${isActive ? "" : "group-hover:-translate-x-full group-hover:opacity-0"}`}>
                    {link.label}
                  </span>
                  {!isActive && (
                    <span className="absolute inset-0 text-[#5b5fef] translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
                      {link.label}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Let's Talk + Menu */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Let's Talk — icon LEFT, text RIGHT. On hover: icon moves right→off, re-enters from left */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 bg-primary text-white text-[11px] font-bold tracking-[0.1em] uppercase pl-1.5 pr-4 py-1.5 rounded-full hover:bg-primary-dark transition-colors group overflow-hidden"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white shrink-0">
              {/* Icon slides: starts left, on hover exits right, re-enters from left */}
              <span className="relative flex items-center justify-center w-full h-full overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
                  <Image src="/google-meet.svg" alt="" width={16} height={16} className="w-4 h-4" />
                </span>
                <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
                  <Image src="/google-meet.svg" alt="" width={16} height={16} className="w-4 h-4" />
                </span>
              </span>
            </span>
            LET&apos;S TALK
          </Link>

          {/* Menu icon button */}
          <OffcanvasMenu />
        </div>
      </div>
    </header>
  );
}
