"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from "react";

const THUMB_HEIGHT = 32;
const TRACK_INSET = 10;

type RailAlign = "border-end" | "border-start" | "inline";

type BookingScrollAreaProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  children: ReactNode;
  className?: string;
  scrollClassName?: string;
  /** Center the rail on a panel border (end = border-r, start = border-l). */
  railAlign?: RailAlign;
};

const RAIL_ALIGN_CLASS: Record<RailAlign, string> = {
  "border-end": "booking-scroll-rail--border-end",
  "border-start": "booking-scroll-rail--border-start",
  inline: "booking-scroll-rail--inline",
};

export function BookingScrollArea({
  children,
  className = "",
  scrollClassName = "",
  railAlign = "border-end",
  ...props
}: BookingScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [showThumb, setShowThumb] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      setShowThumb(false);
      return;
    }

    const trackHeight = el.clientHeight - THUMB_HEIGHT;
    setThumbTop((el.scrollTop / maxScroll) * trackHeight);
    setShowThumb(true);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    update();

    el.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      el.removeEventListener("scroll", update);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [update, children]);

  return (
    <div className={`relative min-h-0 overflow-visible ${className}`}>
      <div
        ref={scrollRef}
        className={`booking-scroll-native h-full min-h-0 overflow-y-auto ${scrollClassName}`}
        {...props}
      >
        {children}
      </div>
      {showThumb && (
        <div
          className={`booking-scroll-rail pointer-events-none absolute ${RAIL_ALIGN_CLASS[railAlign]}`}
          style={{ top: TRACK_INSET, bottom: TRACK_INSET }}
          aria-hidden="true"
        >
          <div
            className="booking-scroll-thumb absolute inset-x-0"
            style={{ top: thumbTop, height: THUMB_HEIGHT }}
          />
        </div>
      )}
    </div>
  );
}
