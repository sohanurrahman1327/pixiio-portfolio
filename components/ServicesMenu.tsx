"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { services } from "@/lib/content";

/* ─── Per-service icon + accent color (matches Services.tsx palette) ─── */
const serviceStyles: Record<string, { bg: string; icon: string }> = {
  BRANDING: {
    bg: "bg-purple-50 dark:bg-purple-500/10",
    icon: "text-purple-600 dark:text-purple-400",
  },
  "UI DESIGN": {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon: "text-blue-600 dark:text-blue-400",
  },
  WEBSITE: {
    bg: "bg-green-50 dark:bg-green-500/10",
    icon: "text-green-600 dark:text-green-400",
  },
  MARKETING: {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    icon: "text-orange-600 dark:text-orange-400",
  },
};

function ServiceIcon({ title }: { title: string }) {
  const paths: Record<string, React.ReactNode> = {
    BRANDING: (
      <path
        d="M12 2a10 10 0 1 0 0 20c1.4 0 2.1-.9 2.1-1.9 0-.5-.2-1-.55-1.35-.35-.4-.55-.85-.55-1.4a2 2 0 0 1 2-2h2.3c2.6 0 4.7-2.1 4.7-4.7C22 5.9 17.5 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    "UI DESIGN": (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M3 9h18M9 9v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    WEBSITE: (
      <>
        <rect x="2.5" y="4.5" width="19" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M8 21h8M12 17.5V21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    MARKETING: (
      <path
        d="M3 17l6-6 4 4 8-8M15 7h6v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {paths[title] ?? null}
    </svg>
  );
}

export default function ServicesMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = pathname === "/services" || pathname.startsWith("/services/");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <Link
        href="/services"
        aria-haspopup="true"
        aria-expanded={open}
        className={`group relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-200 overflow-hidden ${
          isActive ? "text-navy dark:text-white" : "text-gray-500 dark:text-white/60 dark:hover:text-white"
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
            Services
          </span>
          {!isActive && (
            <span className="absolute inset-0 text-primary translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
              Services
            </span>
          )}
        </span>
        {/* Chevron */}
        <svg
          width="9" height="9" viewBox="0 0 10 6" fill="none" aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full left-0 pt-3 transition-all duration-200 ease-out ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1.5 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="w-[360px] bg-surface-elevated rounded-2xl shadow-xl border border-border-subtle p-3">
          {services.map((service) => {
            const style = serviceStyles[service.title] ?? { bg: "bg-gray-50", icon: "text-gray-600" };
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                role="menuitem"
                className="group/item flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-muted transition-colors duration-150"
              >
                <span className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${style.bg} ${style.icon}`}>
                  <ServiceIcon title={service.title} />
                </span>
                <span className="flex-1 min-w-0 pt-0.5">
                  <span className="block text-[12.5px] font-bold text-navy dark:text-white tracking-wide group-hover/item:text-primary transition-colors duration-150">
                    {service.title}
                  </span>
                  <span className="block text-[11.5px] text-gray-500 dark:text-white/55 leading-snug mt-0.5">
                    {service.description}
                  </span>
                </span>
              </Link>
            );
          })}

          {/* Footer — view all */}
          <Link
            href="/services"
            role="menuitem"
            className="group/all flex items-center justify-between gap-2 mt-1 px-2.5 py-2.5 rounded-xl border-t border-border-subtle text-[11px] font-bold tracking-[0.08em] uppercase text-primary hover:bg-surface-muted transition-colors duration-150"
          >
            View All Services
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover/all:translate-x-0.5">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
