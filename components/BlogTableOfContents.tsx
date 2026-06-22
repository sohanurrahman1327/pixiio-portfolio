"use client";

import type { TocItem } from "@/lib/blog-types";

type Props = {
  items: TocItem[];
};

function TocLink({
  item,
  nested = false,
}: {
  item: TocItem;
  nested?: boolean;
}) {
  return (
    <>
      <a
        href={`#${item.id}`}
        className={`block py-1.5 leading-snug transition-colors hover:text-primary ${
          nested
            ? "text-[13px] text-gray-500 pl-3 border-l border-gray-200"
            : "text-sm text-gray-700 font-medium"
        }`}
      >
        {item.text}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="space-y-0.5 mb-2">
          {item.children.map((child) => (
            <li key={child.id}>
              <TocLink item={child} nested />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function BlogTableOfContents({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <nav
      className="rounded-xl border border-gray-200 bg-surface-elevated p-5 shadow-sm"
      aria-label="Table of contents"
    >
      <h3 className="text-sm font-semibold text-navy mb-4 pb-3 border-b border-gray-100">
        On this page
      </h3>
      <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id}>
            <TocLink item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
