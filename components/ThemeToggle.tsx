"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme-context";

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="w-10 h-10 shrink-0" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle bg-surface-elevated text-navy hover:border-primary hover:text-primary transition-colors duration-300 shrink-0 overflow-hidden group dark:border-white/20"
    >
      <span className="relative flex items-center justify-center w-full h-full">
        {/* Light mode — sun slides on hover */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            theme === "light" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
            <SunIcon />
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
            <SunIcon />
          </span>
        </span>

        {/* Dark mode — moon slides on hover */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            theme === "dark" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
            <MoonIcon />
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
            <MoonIcon />
          </span>
        </span>
      </span>
    </button>
  );
}
