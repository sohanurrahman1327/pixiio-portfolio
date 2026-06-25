"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { mailtoBookingRequest } from "@/lib/mailto";
import { GOOGLE_MEET_LINK } from "@/lib/site-config";
import { BookingScrollArea } from "@/components/BookingScrollArea";

function normalizeMeetLink(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.split("?")[0].replace(/\/$/, "");
}

function isMeetLink(raw: string): boolean {
  const link = normalizeMeetLink(raw);
  return /^https:\/\/meet\.google\.com\/[\w-]+$/i.test(link);
}

function openMeetLinkCreator(onMeetLinkChange: (link: string) => void) {
  window.open("https://meet.google.com/new", "_blank", "noopener,noreferrer");

  const onFocus = async () => {
    window.removeEventListener("focus", onFocus);
    try {
      const text = await navigator.clipboard.readText();
      if (isMeetLink(text)) onMeetLinkChange(normalizeMeetLink(text));
    } catch { /* clipboard permission denied */ }
  };
  window.addEventListener("focus", onFocus);
}

function scrollToCreateMeetLink() {
  const target =
    document.getElementById("booking-create-meet-link") ??
    document.getElementById("booking-google-meet");
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ─────────────────────────────── helpers ─────────────────────────────── */

const TZ = "Asia/Dhaka"; // UTC+6
const BOOKING_START = new Date(2025, 6, 1); // July 1, 2025

function getInitialCalendarMonth(today: Date) {
  const start = new Date(BOOKING_START.getFullYear(), BOOKING_START.getMonth(), 1);
  const current = new Date(today.getFullYear(), today.getMonth(), 1);
  return current < start ? start : current;
}

function getTodayInDhaka(): Date {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: TZ })
  );
  now.setHours(0, 0, 0, 0);
  return now;
}

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDow(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function isWeekday(y: number, m: number, d: number) {
  return new Date(y, m, d).getDay() % 6 !== 0; // not Sat(6) or Sun(0)
}

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const DAY_NAMES  = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const DAY_SHORT  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Time slots in Asia/Dhaka (UTC+6)
const TIME_SLOTS_24 = [
  "09:15", "10:45", "12:15", "14:45",
  "16:15", "17:15", "18:45", "19:30",
];

const FALLBACK_TIMEZONES = [
  "Asia/Dhaka", "Asia/Kolkata", "Asia/Singapore", "Asia/Tokyo",
  "Europe/London", "Europe/Berlin", "Europe/Paris",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Australia/Sydney", "Pacific/Auckland",
];

function getSupportedTimezones() {
  try {
    return Intl.supportedValuesOf("timeZone");
  } catch {
    return FALLBACK_TIMEZONES;
  }
}

function getTimezoneOffsetLabel(timezone: string, date: Date) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    return raw.replace("GMT", "UTC");
  } catch {
    return "";
  }
}

function buildTimezoneOptions(date: Date) {
  return getSupportedTimezones()
    .map((id) => ({
      id,
      label: id.replace(/_/g, " "),
      offset: getTimezoneOffsetLabel(id, date),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function formatDateLong(date: Date) {
  return `${DAY_SHORT[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function slotInstant(slot24: string, date: Date) {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return new Date(`${y}-${mo}-${d}T${slot24}:00+06:00`);
}

function formatSlotInTimezone(slot24: string, date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(slotInstant(slot24, date));
}

function parseCustomTime(input: string, ampm: "AM" | "PM", date: Date, timezone: string) {
  const match = input.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h12 = Number(match[1]);
  const m = Number(match[2]);
  if (h12 < 1 || h12 > 12 || m > 59) return null;
  return wallClockToDhaka24(h12, m, ampm, date, timezone);
}

function wallClockToDhaka24(
  h12: number,
  min: number,
  ampm: "AM" | "PM",
  date: Date,
  timezone: string,
) {
  let h = h12;
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;

  const y = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const base = Date.UTC(y, month, day, 0, 0, 0);
  for (let utc = base - 14 * 3_600_000; utc < base + 38 * 3_600_000; utc += 60_000) {
    const parts = formatter.formatToParts(new Date(utc));
    const val = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    if (
      Number(val("year")) === y &&
      Number(val("month")) === month + 1 &&
      Number(val("day")) === day &&
      Number(val("hour")) === h &&
      Number(val("minute")) === min
    ) {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(utc));
    }
  }
  return null;
}

function formatTimeInput(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function isBeforeBookingStart(y: number, m: number, d: number) {
  const dt = new Date(y, m, d);
  dt.setHours(0, 0, 0, 0);
  return dt < BOOKING_START;
}

function formatDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addMins(t: string, m: number) {
  const [h, min] = t.split(":").map(Number);
  const tot = h * 60 + min + m;
  return `${String(Math.floor(tot / 60)).padStart(2,"0")}:${String(tot % 60).padStart(2,"0")}`;
}
function to12h(t: string) {
  let [h, m] = t.split(":").map(Number);
  const s = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${s}`;
}

const SERVICE_OPTIONS = [
  "UI/UX Design",
  "Brand Identity",
  "Website Design & Development",
  "Landing Page Design",
  "Social Media Design",
  "Motion Design & Animation",
  "Marketing Assets",
  "Other / Not sure yet",
];

/* ─────────────────────────────── icons ───────────────────────────────── */

const CLOSE_BTN_CLS =
  "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-surface-elevated text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700";

const Ico = {
  check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="12" height="12" rx="2.5" stroke="#9ca3af" strokeWidth="1.4"/>
      <path d="M3.5 7L6 9.5L10.5 4.5" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shieldCheck: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5L2.5 3.75v4.25c0 3.5 2.35 6.78 5.5 7.75 3.15-.97 5.5-4.25 5.5-7.75V3.75L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M5.5 8L7.25 9.75 10.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  clock: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="#9ca3af" strokeWidth="1.4"/>
      <path d="M7 4.5V7L8.5 8.5" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bolt: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7.5 1.5L3 8h3.5l-.5 4.5L11 6H7.5l.5-4.5z" fill="#5b5fef" stroke="#5b5fef" strokeWidth="0.5" strokeLinejoin="round"/>
    </svg>
  ),
  calendar: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="2.5" width="12" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.4"/>
      <path d="M1 6h12" stroke="#9ca3af" strokeWidth="1.4"/>
      <path d="M4.5 1v3M9.5 1v3" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  chevL: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 12L6 8L10 4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevR: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4L10 8L6 12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevDown: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  clockSm: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7 4.5V7L8.5 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  slotCheck: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4.5 7L6.2 8.7L9.5 5.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  globe: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1.5 7h11M7 1.5c1.8 1.8 2.8 4.2 2.8 5.5S8.8 10.7 7 12.5M7 1.5C5.2 3.3 4.2 5.7 4.2 7s1 4.2 2.8 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  meet: () => (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
      <path d="M1 3.5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 11 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 1 10.5v-7Z" fill="#00832D"/>
      <path d="M11 5.2 14.2 3.4A.8.8 0 0 1 15.5 4v6a.8.8 0 0 1-1.3.6L11 8.8V5.2Z" fill="#0066DA"/>
      <path d="M1 3.5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 11 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 1 10.5v-7Z" stroke="#E8F0FE" strokeWidth="0.5"/>
    </svg>
  ),
  copy: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="7.5" height="7.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M3 9.5V3.5a1 1 0 0 1 1-1h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  external: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5.5 2.5H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M8 2.5h3.5V6M11.5 2.5 6.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  calendarLg: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="3.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 7.5h14" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  x: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  userPlus: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9.5 12v-1a3 3 0 0 0-3-3H4a3 3 0 0 0-3 3v1" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="5.5" cy="4.5" r="2" stroke="#6b7280" strokeWidth="1.3"/>
      <path d="M11.5 5v4M9.5 7h4" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  successCheck: () => (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="28" fill="#f0fdf4"/>
      <circle cx="28" cy="28" r="20" fill="#22c55e"/>
      <path d="M19 28L25 34L37 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

/* ─────────────────────────── Left Panel ────────────────────────────── */

const CLIENT_AVATARS = ["/image-01.jpg", "/image-02.jpg", "/image-03.jpg"] as const;

function PixiioMark() {
  return (
    <svg width="22" height="22" viewBox="30.5 24.8 39 50.4" fill="none" aria-hidden="true">
      <path
        d="M67.9385 55.7363C68.5411 55.1955 69.4997 55.6229 69.5 56.4326V68.3936C69.5 72.129 66.4718 75.1572 62.7363 75.1572C62.5496 75.1572 62.3984 75.0061 62.3984 74.8193V61.1592C62.3984 60.8754 62.5185 60.6047 62.7295 60.415L67.9385 55.7363ZM59.0947 24.8428C59.3599 24.8428 59.6142 24.9483 59.8018 25.1357L69.207 34.541C69.3945 34.7285 69.5 34.9829 69.5 35.248V47.7559C69.5 48.0355 69.3825 48.3028 69.1768 48.4922L59.7871 57.1338C59.6079 57.2987 59.3744 57.3933 59.1309 57.3984L51.3818 57.5615C50.8217 57.5731 50.3615 57.1228 50.3613 56.5625V49.1943C50.3615 48.6422 50.8091 48.1943 51.3613 48.1943H55.3984C55.713 48.1942 56.0094 48.0466 56.1982 47.7949L59.3096 43.6465C59.4392 43.4735 59.5087 43.263 59.5088 43.0469V39.4609C59.5088 39.1959 59.4041 38.9414 59.2168 38.7539L56.1914 35.7285C56.004 35.5411 55.7494 35.4357 55.4844 35.4355H42.5742C42.0219 35.4355 41.5742 35.8833 41.5742 36.4355V51.6855L49.707 59.8184C49.8945 60.0059 50 60.2602 50 60.5254V72.7432C50 73.6341 48.9229 74.0802 48.293 73.4502L41.7471 66.9043C41.5596 66.7168 41.4542 66.4624 41.4541 66.1973V51.5654L30.793 40.9043C30.6055 40.7168 30.5 40.4624 30.5 40.1973V25.8428C30.5 25.2905 30.9477 24.8428 31.5 24.8428H59.0947Z"
        fill="white"
      />
    </svg>
  );
}

function LeftPanel() {
  return (
    <BookingScrollArea
      className="hidden md:flex w-[17.5rem] shrink-0 border-r border-gray-100 bg-surface-elevated max-h-[90vh] min-h-0"
      scrollClassName="p-6 flex flex-col gap-4"
      data-lenis-prevent
    >
      {/* Brand — icon + pixiio + DESIGN AGENCY */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg, #5C64F7 0%, #A36BFF 100%)" }}
        >
          <PixiioMark />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold lowercase leading-none text-navy">pixiio</p>
          <p className="mt-1 text-[9px] font-semibold tracking-[0.2em] text-primary/45">DESIGN AGENCY</p>
        </div>
      </div>

      <h2 className="text-[20px] font-bold leading-tight text-gray-900">Consultation Call</h2>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-medium text-gray-600">
          <span aria-hidden="true">🎨</span> Design-Led
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-medium text-gray-600">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="10" height="7" rx="1" stroke="#6b7280" strokeWidth="1.1"/>
            <path d="M4 10h4" stroke="#6b7280" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          Remote
        </span>
        <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-medium text-gray-600" aria-hidden="true">
          🔥
        </span>
      </div>

      <p className="text-xs leading-relaxed text-gray-500">
        Let&apos;s discuss your goals and create something exceptional together.
      </p>

      {/* Logistics */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-sm text-gray-600"><Ico.check /><span>Requires confirmation</span></div>
        <div className="flex items-center gap-2 text-sm text-gray-600"><Ico.clock /><span>30 minutes</span></div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[7px] font-bold text-white"
            style={{ background: "linear-gradient(135deg,#4285F4 0%,#34A853 50%,#EA4335 100%)" }}
            aria-hidden="true">M</span>
          <span>Google Meet</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Ico.bolt />
          <span>
            We&apos;ll get back within <strong className="font-semibold text-primary">24 hours</strong>
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Social proof */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {CLIENT_AVATARS.map((src, i) => (
              <div key={src} className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                <Image src={src} alt={`Client ${i + 1}`} width={32} height={32} className="h-full w-full object-cover" />
              </div>
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-[9px] font-bold text-white">
              +12
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600">
          Trusted by <strong className="font-semibold text-primary">120+</strong> clients
        </p>
        <p className="text-xs text-gray-600">
          <strong className="font-semibold text-primary">98%</strong> satisfaction rate
        </p>
      </div>

      {/* Testimonial */}
      <div className="mt-auto rounded-xl bg-surface-muted/90 p-3.5">
        <span className="text-lg leading-none text-primary" aria-hidden="true">&ldquo;</span>
        <p className="mt-1 text-xs leading-relaxed text-gray-600">
          Pixiio transformed our ideas into a powerful digital experience.
        </p>
        <p className="mt-2 text-[10px] font-medium text-primary">— CEO, InnovateX</p>
      </div>
    </BookingScrollArea>
  );
}

/* ─────────────────────────── Time Slots Panel ──────────────────────── */

function TimeSlotsPanel({
  selectedDate,
  selectedSlot,
  selectedTimezone,
  onTimezoneChange,
  onSelectSlot,
  onClearSelection,
  onContinue,
  onBackToCalendar,
  onClose,
}: {
  selectedDate: Date;
  selectedSlot: string | null;
  selectedTimezone: string;
  onTimezoneChange: (tz: string) => void;
  onSelectSlot: (slot: string) => void;
  onClearSelection: () => void;
  onContinue: () => void;
  onBackToCalendar: () => void;
  onClose: () => void;
}) {
  const [tzOpen, setTzOpen] = useState(false);
  const [tzSearch, setTzSearch] = useState("");
  const [customSlots, setCustomSlots] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState("");
  const [customAmPm, setCustomAmPm] = useState<"AM" | "PM">("AM");
  const [customError, setCustomError] = useState("");
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [slotsLoading, setSlotsLoading] = useState(false);
  const tzRef = useRef<HTMLDivElement>(null);
  const tzSearchRef = useRef<HTMLInputElement>(null);

  const timezoneOptions = useMemo(() => buildTimezoneOptions(selectedDate), [selectedDate]);
  const tzMeta = timezoneOptions.find((t) => t.id === selectedTimezone)
    ?? { id: selectedTimezone, label: selectedTimezone.replace(/_/g, " "), offset: getTimezoneOffsetLabel(selectedTimezone, selectedDate) };
  const filteredTimezones = useMemo(() => {
    const q = tzSearch.trim().toLowerCase();
    if (!q) return timezoneOptions;
    return timezoneOptions.filter(
      (tz) => tz.label.toLowerCase().includes(q) || tz.offset.toLowerCase().includes(q) || tz.id.toLowerCase().includes(q),
    );
  }, [timezoneOptions, tzSearch]);

  const allSlots = [...TIME_SLOTS_24, ...customSlots.filter((s) => !TIME_SLOTS_24.includes(s))];
  const dateKey = formatDateKey(selectedDate);

  useEffect(() => {
    let cancelled = false;
    setSlotsLoading(true);
    fetch(`/api/booking/slots?date=${dateKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setBookedSlots(new Set(Array.isArray(data.slots) ? data.slots : []));
      })
      .catch(() => {
        if (!cancelled) setBookedSlots(new Set());
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => { cancelled = true; };
  }, [dateKey]);

  useEffect(() => {
    if (selectedSlot && bookedSlots.has(selectedSlot)) onClearSelection();
  }, [bookedSlots, selectedSlot, onClearSelection]);

  useEffect(() => {
    if (!tzOpen) return;
    tzSearchRef.current?.focus();
    const close = (e: MouseEvent) => {
      if (tzRef.current && !tzRef.current.contains(e.target as Node)) {
        setTzOpen(false);
        setTzSearch("");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [tzOpen]);

  function handleAddCustom() {
    const parsed = parseCustomTime(customTime, customAmPm, selectedDate, selectedTimezone);
    if (!parsed) {
      setCustomError("Enter a valid time (HH:MM)");
      return;
    }
    if (bookedSlots.has(parsed)) {
      setCustomError("This time is already booked.");
      return;
    }
    setCustomError("");
    if (!allSlots.includes(parsed)) setCustomSlots((prev) => [...prev, parsed]);
    onSelectSlot(parsed);
    setCustomTime("");
  }

  return (
    <div className="relative flex w-full md:w-[15rem] shrink-0 flex-col border-t md:border-t-0 md:border-l border-gray-100 bg-background px-3.5 py-3 min-h-0 max-h-none md:max-h-[90vh] flex-1 md:flex-none overflow-hidden" data-lenis-prevent>
      <div className="relative flex shrink-0 items-start justify-between gap-2" ref={tzRef}>
        <button
          type="button"
          onClick={onBackToCalendar}
          className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-primary"
          aria-label="Back to calendar"
        >
          <Ico.chevL />
        </button>
        <button
          type="button"
          onClick={() => setTzOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border border-gray-200 bg-surface-elevated px-3 py-2 text-left transition-colors hover:border-primary/40"
        >
          <span className="min-w-0 truncate text-xs font-medium text-gray-900">
            {tzMeta.label} · {tzMeta.offset}
          </span>
          <span className={`shrink-0 text-gray-400 transition-transform ${tzOpen ? "rotate-180" : ""}`}>
            <Ico.chevDown />
          </span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className={CLOSE_BTN_CLS}
          aria-label="Close"
        >
          <Ico.x />
        </button>

        {tzOpen && (
          <div className="absolute left-0 right-10 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-gray-100 bg-surface-elevated shadow-lg">
            <div className="border-b border-gray-100 p-2">
              <p className="mb-1.5 px-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Select a Timezone</p>
              <input
                ref={tzSearchRef}
                type="search"
                value={tzSearch}
                onChange={(e) => setTzSearch(e.target.value)}
                placeholder="Search timezone…"
                className="w-full rounded-lg border border-gray-200 bg-background px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-primary"
              />
            </div>
            <BookingScrollArea className="max-h-44" scrollClassName="py-1" railAlign="inline">
              {filteredTimezones.length === 0 ? (
                <p className="px-3 py-2 text-xs text-gray-400">No timezones found</p>
              ) : (
                filteredTimezones.map((tz) => (
                  <button
                    key={tz.id}
                    type="button"
                    onClick={() => {
                      onTimezoneChange(tz.id);
                      setTzOpen(false);
                      setTzSearch("");
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-surface-muted ${
                      tz.id === selectedTimezone ? "text-primary font-semibold" : "text-gray-700"
                    }`}
                  >
                    <span className="truncate">{tz.label}</span>
                    <span className="shrink-0 text-gray-400">{tz.offset}</span>
                  </button>
                ))
              )}
            </BookingScrollArea>
          </div>
        )}
      </div>

      <p className="mt-2 shrink-0 text-xs text-gray-400">
        {formatDateLong(selectedDate)}
        {slotsLoading ? " · Checking availability…" : ""}
      </p>

      <BookingScrollArea className="mt-2 min-h-0 flex-1 md:-ml-3.5 md:pl-3.5" railAlign="border-start" data-lenis-prevent>
        <div className="flex flex-col gap-2 pb-1">
          {allSlots.map((raw, i) => {
            const booked = bookedSlots.has(raw);
            const selected = selectedSlot === raw;
            const label = formatSlotInTimezone(raw, selectedDate, selectedTimezone);
            const state = selected
              ? "booking-time-slot--selected"
              : booked
                ? "booking-time-slot--booked"
                : "booking-time-slot--available";

            return (
              <button
                key={`${raw}-${i}`}
                type="button"
                disabled={booked}
                onClick={() => !booked && onSelectSlot(raw)}
                className={`booking-time-slot ${state}`}
                aria-pressed={selected}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 opacity-80"><Ico.clockSm /></span>
                  <span className="truncate text-sm font-medium">{label}</span>
                </span>
                <span className="shrink-0 text-[11px] font-medium">
                  {selected ? (
                    <span className="flex items-center gap-1">
                      <Ico.slotCheck /> Selected
                    </span>
                  ) : booked ? (
                    "Booked"
                  ) : (
                    <span className="text-gray-400">Available</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </BookingScrollArea>

      <div className="mt-3 shrink-0 pt-3">
        <p className="mb-2 text-xs font-semibold text-gray-900">Add a custom time</p>
        <div className="flex gap-1.5">
          <div className="relative flex min-w-0 flex-1 items-center">
            <span className="pointer-events-none absolute left-2.5 text-primary/70"><Ico.clockSm /></span>
            <input
              type="text"
              inputMode="numeric"
              value={customTime}
              onChange={(e) => { setCustomTime(formatTimeInput(e.target.value)); setCustomError(""); }}
              placeholder="HH:MM"
              maxLength={5}
              className="w-full rounded-xl border border-gray-200 bg-surface-elevated py-2 pl-8 pr-2 text-xs text-gray-900 outline-none focus:border-primary"
            />
          </div>
          <select
            value={customAmPm}
            onChange={(e) => setCustomAmPm(e.target.value as "AM" | "PM")}
            className="rounded-xl border border-gray-200 bg-surface-elevated px-2 text-xs text-gray-700 outline-none focus:border-primary"
            aria-label="AM or PM"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
          <button
            type="button"
            onClick={handleAddCustom}
            className="shrink-0 rounded-xl bg-primary px-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Add
          </button>
        </div>
        {customError && <p className="mt-1 text-[10px] text-red-500">{customError}</p>}
        <p className="mt-2 text-[10px] leading-relaxed text-gray-400">
          Times shown in {tzMeta.label} ({tzMeta.offset})
        </p>
        <button
          type="button"
          disabled={!selectedSlot}
          onClick={onContinue}
          className="mt-4 mb-4 w-full rounded-xl bg-gray-900 px-4 py-4 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── Success Screen ────────────────────────── */

function SuccessScreen({ name, onClose }: { name: string; onClose: () => void }) {
  const router = useRouter();
  const [secs, setSecs] = useState(6);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecs(s => {
        if (s <= 1) { clearInterval(interval); router.push("/"); onClose(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router, onClose]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center">
      <Ico.successCheck />
      <h3 className="font-bold text-2xl text-gray-900 mt-5">Booking Confirmed!</h3>
      <p className="text-gray-500 text-sm mt-3 max-w-xs leading-relaxed">
        Thanks, <strong>{name}</strong>! We&apos;ve received your request and will confirm your slot via email shortly.
      </p>

      <Link
        href="/services"
        onClick={onClose}
        className="mt-8 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
      >
        View Our Services
      </Link>

      <button
        onClick={() => { router.push("/"); onClose(); }}
        className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
      >
        Back to Homepage
      </button>

      <p className="mt-4 text-xs text-gray-300">
        Redirecting to homepage in {secs}s…
      </p>
    </div>
  );
}

/* ─────────────────────────── Meeting Summary Panel ───────────────── */

function MeetingSummaryPanel({
  selectedDate,
  selectedSlot,
  selectedTimezone,
  meetLink: formMeetLink,
  onMeetLinkChange,
}: {
  selectedDate: Date;
  selectedSlot: string;
  selectedTimezone: string;
  meetLink: string;
  onMeetLinkChange: (link: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const weekday = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
  const dateLabel = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
  const timeLabel = `${to12h(selectedSlot)} – ${to12h(addMins(selectedSlot, 30))}`;
  const tzLabel = selectedTimezone.replace(/_/g, " ");
  const tzOffset = getTimezoneOffsetLabel(selectedTimezone, selectedDate);
  const configuredMeetLink = GOOGLE_MEET_LINK.trim();
  const meetCode = configuredMeetLink.replace(/^https?:\/\/meet\.google\.com\//, "").split("?")[0];
  const formMeetLinkNormalized = normalizeMeetLink(formMeetLink);

  function addLinkToForm(link: string) {
    onMeetLinkChange(normalizeMeetLink(link));
  }

  async function handleCopy() {
    if (!configuredMeetLink) return;
    try {
      await navigator.clipboard.writeText(configuredMeetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  }

  function handleCreateMeetLink() {
    openMeetLinkCreator(addLinkToForm);
  }

  const metaRows = [
    { icon: <Ico.clockSm />, label: "30 Minutes", sub: "Discovery call" },
    { icon: <Ico.globe />, label: tzLabel, sub: tzOffset },
  ];

  return (
    <aside className="flex w-full md:min-w-0 md:flex-1 flex-col min-h-0 px-4 pb-4 md:px-0 md:pb-0 md:mt-8" aria-label="Meeting summary">
      <BookingScrollArea className="min-h-0 flex-1" railAlign="inline">
      <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100/80 bg-surface-elevated shadow-[0_4px_24px_rgba(91,95,239,0.08)] ring-1 ring-black/[0.03]">
        {/* Header + date */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#7c5cfc] p-4 text-white">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-4 right-8 h-16 w-16 rounded-full bg-white/5" aria-hidden="true" />

          <div className="relative flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
              <Ico.calendarLg />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">Your Meeting</span>
          </div>

          <p className="relative mt-3 text-[1.2rem] font-bold leading-tight">{dateLabel}</p>
          <p className="relative mt-0.5 text-sm font-medium text-white/75">{weekday}</p>

          <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <span className="text-white/90"><Ico.clockSm /></span>
            <span>{timeLabel}</span>
          </div>
        </div>

        {/* Meta rows + Google Meet — uniform inner padding */}
        <div className="flex flex-col gap-3 p-4">
          {metaRows.map(({ icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
                {icon}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-[11px] text-gray-500">{sub}</p>
              </div>
            </div>
          ))}

          {/* Google Meet */}
          <div id="booking-google-meet" className="pt-1 scroll-mt-4">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F5E9]">
                <Ico.meet />
              </span>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Google Meet</p>
            </div>

            {configuredMeetLink ? (
              <div className="rounded-xl border border-[#34A853]/20 bg-gradient-to-br from-[#f6fff8] to-white p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#188038]">Meeting link ready</p>
                <p className="truncate font-mono text-xs font-medium text-gray-700" title={configuredMeetLink}>
                  meet.google.com/{meetCode}
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={configuredMeetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#188038] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#137333]"
                  >
                    <Ico.external />
                    Join
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <Ico.copy />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => addLinkToForm(configuredMeetLink)}
                  disabled={formMeetLinkNormalized === normalizeMeetLink(configuredMeetLink)}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#34A853]/30 bg-white px-3 py-2 text-xs font-semibold text-[#188038] transition-colors hover:border-[#34A853]/50 hover:bg-[#f6fff8] disabled:cursor-default disabled:opacity-50"
                >
                  {formMeetLinkNormalized === normalizeMeetLink(configuredMeetLink) ? "Added to form" : "Add to booking form"}
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-3">
                <p className="text-xs leading-relaxed text-gray-500">
                  Create a Meet link, copy it, then return here — it will fill in the booking form automatically.
                </p>
                <button
                  id="booking-create-meet-link"
                  type="button"
                  onClick={handleCreateMeetLink}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark"
                >
                  <Ico.external />
                  Create a Meet link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </BookingScrollArea>
    </aside>
  );
}

/* ─────────────────────────── Booking Form ──────────────────────────── */

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  notes: string;
  guests: string;
}

function BookingForm({
  selectedDate, selectedSlot, selectedTimezone, meetLink, onMeetLinkChange, onBack, onSuccess,
}: {
  selectedDate: Date;
  selectedSlot: string;
  selectedTimezone: string;
  meetLink: string;
  onMeetLinkChange: (link: string) => void;
  onBack: () => void;
  onSuccess: (name: string) => void;
}) {
  const [fd, setFd]             = useState<FormData>({ name:"", email:"", phone:"", service:"", notes:"", guests:"" });
  const [showGuests, setGuests] = useState(false);
  const [submitting, setSub]    = useState(false);
  const [errors, setErrors]     = useState<Partial<FormData>>({});
  const [meetLinkError, setMeetLinkError] = useState("");
  const [apiError, setApiError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  function validate() {
    const e: Partial<FormData> = {};
    if (!fd.name.trim())    e.name    = "Name is required";
    if (!fd.email.trim())   e.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.email)) e.email = "Enter a valid email";
    if (!fd.phone.trim())   e.phone   = "Phone number is required";
    else if (!/^[+\d][\d\s()-]{6,}$/.test(fd.phone.trim())) e.phone = "Enter a valid phone number";
    if (!fd.service)        e.service = "Please select a service";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    const meetErr = meetLink.trim() && !isMeetLink(meetLink) ? "Enter a valid Google Meet link" : "";
    if (Object.keys(errs).length || meetErr) { setErrors(errs); setMeetLinkError(meetErr); return; }
    setErrors({}); setMeetLinkError(""); setApiError(""); setSub(true);

    const normalizedMeetLink = meetLink.trim() ? normalizeMeetLink(meetLink) : "";

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.name,
          email: fd.email,
          phone: fd.phone.trim(),
          service: fd.service,
          notes: fd.notes,
          guests: fd.guests ? fd.guests.split(",").map(g => g.trim()).filter(Boolean) : [],
          meetLink: normalizedMeetLink || undefined,
          date: selectedDate.toISOString(),
          slot: to12h(selectedSlot),
          slotKey: selectedSlot,
          timezone: selectedTimezone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fallback === "mailto") {
          const bookingDate = selectedDate.toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
            timeZone: "Asia/Dhaka",
          });
          window.location.href = mailtoBookingRequest({
            name: fd.name,
            email: fd.email,
            phone: fd.phone.trim(),
            service: fd.service,
            notes: fd.notes,
            date: bookingDate,
            slot: to12h(selectedSlot),
            timezone: selectedTimezone,
            guests: fd.guests ? fd.guests.split(",").map(g => g.trim()).filter(Boolean) : [],
            meetLink: normalizedMeetLink || undefined,
          });
          onSuccess(fd.name);
          return;
        }
        throw new Error(data.error || "Failed");
      }
      onSuccess(fd.name);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSub(false);
    }
  }

  const inputCls = (field: keyof FormData) =>
    `w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors ${
      errors[field] ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-primary"
    }`;

  return (
    <BookingScrollArea
      className="flex min-h-0 flex-1 w-full md:w-[24.5rem] shrink-0 max-h-full md:border-r border-gray-100"
      scrollClassName="p-4 sm:p-7 flex flex-col min-h-0"
      data-lenis-prevent
    >
    <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col gap-4 flex-1">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Your name <span className="text-red-500">*</span></label>
          <input ref={nameRef} type="text" value={fd.name}
            onChange={e => setFd(p => ({ ...p, name: e.target.value }))}
            className={inputCls("name")} autoComplete="off" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Email address <span className="text-red-500">*</span></label>
          <input type="email" value={fd.email}
            onChange={e => setFd(p => ({ ...p, email: e.target.value }))}
            className={inputCls("email")} autoComplete="email" />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Phone number <span className="text-red-500">*</span></label>
          <input type="tel" value={fd.phone}
            onChange={e => setFd(p => ({ ...p, phone: e.target.value }))}
            className={inputCls("phone")} autoComplete="tel" placeholder="+880 1XXX-XXXXXX" />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Service */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            What service are you interested in? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={fd.service}
              onChange={e => setFd(p => ({ ...p, service: e.target.value }))}
              className={`${inputCls("service")} appearance-none bg-surface-elevated cursor-pointer pr-10`}
            >
              <option value="" disabled>Select a service…</option>
              {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-gray-400">
              <Ico.chevDown />
            </span>
          </div>
          {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Additional notes</label>
          <textarea value={fd.notes}
            onChange={e => setFd(p => ({ ...p, notes: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary transition-colors resize-none"
            placeholder="Please share anything that will help prepare for our meeting."
            rows={3} />
        </div>

        {/* Google Meet link (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            Google Meet link <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="url"
            value={meetLink}
            onChange={e => {
              onMeetLinkChange(e.target.value);
              if (meetLinkError) setMeetLinkError("");
            }}
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors ${
              meetLinkError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-primary"
            }`}
            placeholder="https://meet.google.com/abc-defg-hij"
            autoComplete="off"
          />
          {meetLinkError ? (
            <p className="text-xs text-red-500 mt-1">{meetLinkError}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              Use{" "}
              <button
                type="button"
                onClick={scrollToCreateMeetLink}
                className="font-medium text-primary hover:text-primary-dark underline underline-offset-2 transition-colors"
              >
                Create a Meet link
              </button>{" "}
              <span className="hidden md:inline">on the right</span>
              <span className="md:hidden">above</span>
              , copy the link, and it will appear here automatically.
            </p>
          )}
        </div>

        {/* Add guests */}
        <div>
          <button type="button" onClick={() => setGuests(v => !v)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <Ico.userPlus />
            <span>{showGuests ? "Hide guests" : "Add guests"}</span>
          </button>
          {showGuests && (
            <input type="text" value={fd.guests}
              onChange={e => setFd(p => ({ ...p, guests: e.target.value }))}
              className="mt-2 w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary transition-colors"
              placeholder="guest@example.com, another@example.com" />
          )}
        </div>
      </div>

      {/* API error */}
      {apiError && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{apiError}</p>
      )}

      {/* Footer */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-4">
          By proceeding, you agree to our{" "}
          <a href="/terms" className="underline hover:text-gray-600">Terms</a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onBack} disabled={submitting}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50">
            Back
          </button>
          <button type="submit" disabled={submitting}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60">
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round"/>
                </svg>
                Confirming…
              </>
            ) : "Confirm"}
          </button>
        </div>
      </div>
    </form>
    </BookingScrollArea>
  );
}

/* ──────────────────────────── Main Modal ───────────────────────────── */

export default function BookingModal() {
  const { isOpen, close } = useBooking();
  const today = getTodayInDhaka();

  const [mounted, setMounted]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [step, setStep]         = useState<"calendar"|"form"|"success">("calendar");
  const [successName, setSuccessName] = useState("");
  const [currentMonth, setCM]   = useState(() => getInitialCalendarMonth(getTodayInDhaka()));
  const [selectedDate, setDate] = useState<Date | null>(null);
  const [selectedSlot, setSlot] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState(TZ);
  const [bookingMeetLink, setBookingMeetLink] = useState("");

  /* animation */
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
    setVisible(false);
    const t = setTimeout(() => {
      setMounted(false);
      setStep("calendar"); setDate(null); setSlot(null);
      setSelectedTimezone(TZ);
      setBookingMeetLink("");
      setCM(getInitialCalendarMonth(getTodayInDhaka()));
    }, 220);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => { setSlot(null); }, [selectedDate]);

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") close(); }, [close]);
  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [isOpen, handleKey]);

  if (!mounted) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const cells: (number | null)[] = [];
  for (let i = 0; i < getFirstDow(year, month); i++) cells.push(null);
  for (let d = 1; d <= getDaysInMonth(year, month); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isAvail = (d: number) => {
    const dt = new Date(year, month, d); dt.setHours(0,0,0,0);
    return !isBeforeBookingStart(year, month, d) && dt > today && isWeekday(year, month, d);
  };
  const isSel  = (d: number) => !!selectedDate && selectedDate.getFullYear()===year && selectedDate.getMonth()===month && selectedDate.getDate()===d;
  const canGoPrevMonth = year > BOOKING_START.getFullYear()
    || (year === BOOKING_START.getFullYear() && month > BOOKING_START.getMonth());

  const isSuccess = step === "success";
  const isForm    = step === "form";

  return (
    /* Backdrop */
    <div
      className={`fixed inset-0 z-[9998] flex items-end md:items-center justify-center transition-opacity duration-200 overscroll-contain p-0 md:p-4 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={close}
      role="dialog" aria-modal="true" aria-label="Book a discovery call"
      data-lenis-prevent
    >
      {/* Modal card */}
      <div
        className={`bg-surface-elevated rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:mx-4 max-h-[92dvh] md:max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative transition-all duration-200 min-h-0
          ${isSuccess ? "max-w-md" : isForm ? "max-w-full md:max-w-[60rem]" : "max-w-full md:max-w-4xl"}
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        onClick={e => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Close X — top-right (hidden when time panel is open) */}
        {!(step === "calendar" && selectedDate) && (
          <button
            type="button"
            onClick={close}
            className={`absolute top-3 right-3 z-30 ${CLOSE_BTN_CLS}${isForm ? "" : " shadow-sm"}`}
            aria-label="Close"
          >
            <Ico.x />
          </button>
        )}

        {/* ── Success ── */}
        {isSuccess && (
          <SuccessScreen name={successName} onClose={close} />
        )}

        {/* ── Calendar / Form ── */}
        {!isSuccess && (
          <>
            <LeftPanel />

            {/* Calendar step */}
            {step === "calendar" && (
              <div className="flex min-h-0 flex-1 flex-col md:flex-row overflow-y-auto md:overflow-hidden">
                <div
                  className={`flex-1 p-4 md:p-6 md:border-r border-gray-100 overflow-y-auto md:overflow-hidden flex flex-col min-h-0 ${
                    selectedDate ? "hidden md:flex" : "flex"
                  }`}
                  data-lenis-prevent
                >
                  <div className="md:hidden shrink-0 mb-4 pb-4 border-b border-gray-100">
                    <p className="text-base font-bold text-gray-900">Consultation Call</p>
                    <p className="mt-0.5 text-xs text-gray-500">30 minutes · Google Meet · Remote</p>
                  </div>

                  <div className={`bg-background p-4 md:p-5 booking-cal ${selectedDate ? "booking-cal--compact" : "booking-cal--expanded"}`}>
                    <div className="flex items-center justify-center gap-3 mb-5">
                      <button
                        type="button"
                        onClick={() => { if (!canGoPrevMonth) return; setCM(new Date(year, month - 1, 1)); setDate(null); }}
                        disabled={!canGoPrevMonth}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-primary disabled:opacity-25 disabled:pointer-events-none"
                        aria-label="Previous month"
                      >
                        <Ico.chevL />
                      </button>
                      <div className="min-w-[9rem] text-center">
                        <span className="font-semibold text-gray-900">{MONTH_NAMES[month]}</span>
                        <span className="text-gray-400 ml-1.5">{year}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setCM(new Date(year, month + 1, 1)); setDate(null); }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-primary"
                        aria-label="Next month"
                      >
                        <Ico.chevR />
                      </button>
                    </div>

                    <div className="booking-cal-weekdays">
                      {DAY_NAMES.map((d, i) => (
                        <div
                          key={d}
                          className={`text-[10px] font-bold tracking-[0.14em] text-center py-0.5 ${
                            i === 0 || i === 6 ? "text-gray-300" : "text-gray-400"
                          }`}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="booking-cal-grid">
                      {cells.map((day, idx) => {
                        if (!day) return <div key={`e${idx}`} className="booking-cal-cell" aria-hidden="true" />;
                        if (isBeforeBookingStart(year, month, day)) {
                          return <div key={`b${day}`} className="booking-cal-cell" aria-hidden="true" />;
                        }
                        const avail = isAvail(day), sel = isSel(day);
                        const dayState = sel
                          ? "booking-cal-day--active"
                          : avail
                            ? "booking-cal-day--available"
                            : "booking-cal-day--unavailable";
                        return (
                          <div key={day} className="booking-cal-cell">
                            <button
                              type="button"
                              onClick={() => avail && setDate(new Date(year, month, day))}
                              disabled={!avail}
                              className={`booking-cal-day relative flex items-center justify-center text-sm font-semibold ${dayState}`}
                              aria-pressed={sel}
                            >
                              {day}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p className="mt-4 text-center text-xs text-gray-400">
                    {selectedDate ? (
                      <>
                        <span className="hidden md:inline">Choose a time slot on the right</span>
                        <span className="md:hidden">Pick a time below</span>
                      </>
                    ) : (
                      "Select an available weekday to continue"
                    )}
                  </p>

                  <div className="mt-auto flex items-center justify-center gap-2 pt-4 sm:pt-5">
                    <span className="shrink-0 text-primary"><Ico.shieldCheck /></span>
                    <p className="text-xs leading-snug text-gray-600">
                      Your information is safe with us.{" "}
                      <Link href="/privacy" onClick={close} className="font-medium text-primary hover:text-primary-dark transition-colors">
                        Privacy protected.
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <TimeSlotsPanel
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    selectedTimezone={selectedTimezone}
                    onTimezoneChange={setSelectedTimezone}
                    onSelectSlot={setSlot}
                    onClearSelection={() => setSlot(null)}
                    onContinue={() => setStep("form")}
                    onBackToCalendar={() => { setDate(null); setSlot(null); }}
                    onClose={close}
                  />
                )}
              </div>
            )}

            {/* Form step */}
            {step === "form" && selectedDate && selectedSlot && (
              <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row overflow-hidden py-0 pb-6 md:py-4 md:pr-4 gap-0 md:gap-4">
                <div className="order-2 md:order-1 flex min-h-0 flex-1 flex-col overflow-hidden md:flex-none">
                <BookingForm
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  selectedTimezone={selectedTimezone}
                  meetLink={bookingMeetLink}
                  onMeetLinkChange={setBookingMeetLink}
                  onBack={() => { setBookingMeetLink(""); setStep("calendar"); }}
                  onSuccess={(name) => { setSuccessName(name); setStep("success"); }}
                />
                </div>
                <div className="order-1 md:order-2 shrink-0 md:shrink md:min-h-0 md:flex-1 pt-12 md:pt-0">
                <MeetingSummaryPanel
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  selectedTimezone={selectedTimezone}
                  meetLink={bookingMeetLink}
                  onMeetLinkChange={setBookingMeetLink}
                />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
