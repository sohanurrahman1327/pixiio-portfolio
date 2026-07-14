"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  basePath: string;
  initialQuery?: string;
  currentParams?: Record<string, string | undefined>;
};

export default function LibrarySearch({
  basePath,
  initialQuery = "",
  currentParams = {},
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(currentParams)) {
      if (value && key !== "q") params.set(key, value);
    }
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${basePath}?${qs}` : basePath);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <label htmlFor="library-search" className="sr-only">
        Search components, blocks and templates
      </label>
      <input
        id="library-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search components, blocks and templates..."
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-surface-elevated text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
      />
    </form>
  );
}
