"use client";

import { useEffect, useMemo, useState } from "react";
import type { TocItem } from "@/lib/blog-types";

type Props = {
  items: TocItem[];
};

function flattenToc(items: TocItem[]): TocItem[] {
  const flat: TocItem[] = [];
  for (const item of items) {
    flat.push(item);
    if (item.children?.length) {
      flat.push(...item.children);
    }
  }
  return flat;
}

export default function BlogTableOfContents({ items }: Props) {
  const flatItems = useMemo(() => flattenToc(items), [items]);
  const [expanded, setExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(
    flatItems[0]?.id ?? null
  );

  useEffect(() => {
    if (flatItems.length === 0) return;

    const headings = flatItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 1],
      }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [flatItems]);

  if (flatItems.length === 0) return null;

  return (
    <div className="blog-toc">
      <aside
        aria-label="On this page"
        className={`article-toc-panel${expanded ? " is-expanded" : ""}`}
        tabIndex={0}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setExpanded(false);
          }
        }}
      >
        <div
          className="article-toc-mini"
          aria-hidden="true"
          onClick={() => setExpanded(true)}
        >
          {flatItems.map((item) => (
            <div
              key={item.id}
              className={`article-toc-mini__item article-toc-mini__item--level-${item.level}${
                activeId === item.id ? " is-active" : ""
              }`}
            />
          ))}
        </div>

        <div className="article-toc-panel__title">On this page</div>

        <div className="article-toc-panel__body">
          <nav className="article-toc" aria-label="On this page">
            <ul className="article-toc__list">
              {flatItems.map((item) => (
                <li
                  key={item.id}
                  className={`article-toc__item article-toc__item--level-${item.level}`}
                >
                  <a
                    href={`#${item.id}`}
                    className={`article-toc__link${
                      activeId === item.id ? " is-active" : ""
                    }`}
                    onClick={() => setExpanded(false)}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
