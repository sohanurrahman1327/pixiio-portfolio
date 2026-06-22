"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { libraryTabs } from "@/lib/library";

const tabIcons: Record<string, React.ReactNode> = {
  components: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  blocks: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="8" width="12" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  templates: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 5h12" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
};

export default function LibraryTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 bg-surface-elevated">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide" aria-label="Library sections">
          {libraryTabs.map((tab) => {
            const href = `/library/${tab.slug}`;
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={tab.slug}
                href={href}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tabIcons[tab.slug]}
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
