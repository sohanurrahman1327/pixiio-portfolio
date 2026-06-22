"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";

/* ─────────────────────────────── helpers ─────────────────────────────── */

const TZ = "Asia/Dhaka"; // UTC+6

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

// Time slots in Asia/Dhaka (UTC+6) — evening slots
const TIME_SLOTS_24 = [
  "16:15","16:45","17:15","17:45",
  "18:15","18:45","19:15","19:45",
  "20:15","20:45",
];

function addMins(t: string, m: number) {
  const [h, min] = t.split(":").map(Number);
  const tot = h * 60 + min + m;
  return `${String(Math.floor(tot / 60)).padStart(2,"0")}:${String(tot % 60).padStart(2,"0")}`;
}
function to12h(t: string) {
  let [h, m] = t.split(":").map(Number);
  const s = h >= 12 ? "pm" : "am";
  if (h > 12) h -= 12; if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2,"0")}${s}`;
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

const Ico = {
  check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="12" height="12" rx="2.5" stroke="#9ca3af" strokeWidth="1.4"/>
      <path d="M3.5 7L6 9.5L10.5 4.5" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  clock: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="#9ca3af" strokeWidth="1.4"/>
      <path d="M7 4.5V7L8.5 8.5" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  globe: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="#9ca3af" strokeWidth="1.4"/>
      <ellipse cx="7" cy="7" rx="2.5" ry="5.5" stroke="#9ca3af" strokeWidth="1.4"/>
      <line x1="1.5" y1="7" x2="12.5" y2="7" stroke="#9ca3af" strokeWidth="1.4"/>
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

function LeftPanel({
  selectedDate, selectedSlot, is24h,
}: {
  selectedDate: Date | null;
  selectedSlot: string | null;
  is24h: boolean;
}) {
  const dateStr = selectedDate
    ? `${DAY_SHORT[selectedDate.getDay()]}, ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    : null;
  const timeStr = selectedSlot
    ? `${is24h ? selectedSlot : to12h(selectedSlot)} – ${is24h ? addMins(selectedSlot,30) : to12h(addMins(selectedSlot,30))}`
    : null;

  return (
    <div className="w-60 shrink-0 border-r border-gray-100 p-7 flex flex-col gap-5 overflow-y-auto">
      {/* Logo */}
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
        <Image src="/pixiio-logo.svg" alt="Pixiio" width={36} height={36} className="w-8 h-8 object-contain" />
      </div>

      {/* Agency info */}
      <div>
        <p className="text-sm text-primary font-semibold">Pixiio Design Agency</p>
        <div className="mt-3" />
        <h2 className="font-bold text-xl text-gray-900 leading-tight">30 Min Meeting</h2>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          🎨 Design-Led | Remote | 🔥 98% Satisfaction | 📈 120+ Projects
        </p>
        <p className="text-sm text-gray-600 mt-3">Book a Discovery Call</p>
      </div>

      {/* Selected date/time (form step only) */}
      {dateStr && timeStr && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-0.5 shrink-0"><Ico.calendar /></span>
            <span>
              <span className="font-medium">{dateStr}</span>
              <br />
              <span className="text-gray-500">{timeStr}</span>
              <br />
              <span className="text-xs text-gray-400">{TZ}</span>
            </span>
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-sm text-gray-600"><Ico.check /><span>Requires confirmation</span></div>
        <div className="flex items-center gap-2 text-sm text-gray-600"><Ico.clock /><span>30m</span></div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center text-white text-[7px] font-bold"
            style={{ background: "linear-gradient(135deg,#4285F4 0%,#34A853 50%,#EA4335 100%)" }}
            aria-hidden="true">M</span>
          <span>Google Meet</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600"><Ico.globe /><span>Asia/Dhaka (UTC+6)</span></div>
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
    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
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

/* ─────────────────────────── Booking Form ──────────────────────────── */

interface FormData {
  name: string;
  email: string;
  service: string;
  notes: string;
  guests: string;
}

function BookingForm({
  selectedDate, selectedSlot, is24h, onBack, onSuccess,
}: {
  selectedDate: Date;
  selectedSlot: string;
  is24h: boolean;
  onBack: () => void;
  onSuccess: (name: string) => void;
}) {
  const [fd, setFd]             = useState<FormData>({ name:"", email:"", service:"", notes:"", guests:"" });
  const [showGuests, setGuests] = useState(false);
  const [submitting, setSub]    = useState(false);
  const [errors, setErrors]     = useState<Partial<FormData>>({});
  const [apiError, setApiError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  function validate() {
    const e: Partial<FormData> = {};
    if (!fd.name.trim())    e.name    = "Name is required";
    if (!fd.email.trim())   e.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.email)) e.email = "Enter a valid email";
    if (!fd.service)        e.service = "Please select a service";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setApiError(""); setSub(true);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.name,
          email: fd.email,
          service: fd.service,
          notes: fd.notes,
          guests: fd.guests ? fd.guests.split(",").map(g => g.trim()).filter(Boolean) : [],
          date: selectedDate.toISOString(),
          slot: is24h ? selectedSlot : to12h(selectedSlot),
          timezone: TZ,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
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
    <form onSubmit={handleSubmit} noValidate className="flex-1 p-7 overflow-y-auto flex flex-col">
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

        {/* Service */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            What service are you interested in? <span className="text-red-500">*</span>
          </label>
          <select
            value={fd.service}
            onChange={e => setFd(p => ({ ...p, service: e.target.value }))}
            className={`${inputCls("service")} bg-surface-elevated cursor-pointer`}
          >
            <option value="" disabled>Select a service…</option>
            {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
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
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60">
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
  const [currentMonth, setCM]   = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setDate] = useState<Date | null>(null);
  const [selectedSlot, setSlot] = useState<string | null>(null);
  const [is24h, set24h]         = useState(true);

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
      setCM(new Date(today.getFullYear(), today.getMonth(), 1));
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
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
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
    return dt > today && isWeekday(year, month, d);
  };
  const isSel  = (d: number) => !!selectedDate && selectedDate.getFullYear()===year && selectedDate.getMonth()===month && selectedDate.getDate()===d;
  const isToday = (d: number) => today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;

  const displaySlots = is24h ? TIME_SLOTS_24 : TIME_SLOTS_24.map(to12h);
  const selDow = selectedDate ? DAY_SHORT[selectedDate.getDay()] : "";
  const selDay = selectedDate?.getDate() ?? 0;

  const isSuccess = step === "success";
  const isForm    = step === "form";

  return (
    /* Backdrop */
    <div
      className={`fixed inset-0 z-[9998] flex items-center justify-center transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={close}
      role="dialog" aria-modal="true" aria-label="Book a discovery call"
    >
      {/* Close button — OUTSIDE the card, top-right */}
      <button
        onClick={close}
        className={`absolute z-10 flex items-center justify-center w-8 h-8 rounded-full bg-surface-elevated/90 text-gray-500 hover:text-gray-900 hover:bg-surface-elevated shadow transition-colors
          ${visible ? "opacity-100" : "opacity-0"}`}
        style={{
          top: "calc(50% - min(45vh, 260px))",
          right: "calc(50% - min(calc((${isForm ? 672 : 896}px + 2rem) / 2), 50vw + 1rem) + 2px)",
        }}
        aria-label="Close"
      >
        <Ico.x />
      </button>

      {/* Modal card */}
      <div
        className={`bg-surface-elevated rounded-2xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex relative transition-all duration-200
          ${isSuccess ? "max-w-md" : isForm ? "max-w-2xl" : "max-w-4xl"}
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close X inside modal top-right corner for all views */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <Ico.x />
        </button>

        {/* ── Success ── */}
        {isSuccess && (
          <SuccessScreen name={successName} onClose={close} />
        )}

        {/* ── Calendar / Form ── */}
        {!isSuccess && (
          <>
            <LeftPanel
              selectedDate={isForm ? selectedDate : null}
              selectedSlot={isForm ? selectedSlot : null}
              is24h={is24h}
            />

            {/* Calendar step */}
            {step === "calendar" && (
              <>
                <div className="flex-1 p-6 border-r border-gray-100 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{MONTH_NAMES[month]}</span>
                      <span className="text-gray-400">{year}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setCM(new Date(year, month-1, 1)); setDate(null); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Prev month"><Ico.chevL /></button>
                      <button onClick={() => { setCM(new Date(year, month+1, 1)); setDate(null); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Next month"><Ico.chevR /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 mb-2">
                    {DAY_NAMES.map(d => (
                      <div key={d} className="text-xs font-semibold text-gray-400 tracking-wide text-center py-1">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-1">
                    {cells.map((day, idx) => {
                      if (!day) return <div key={`e${idx}`} />;
                      const avail = isAvail(day), sel = isSel(day), tod = isToday(day);
                      return (
                        <div key={day} className="flex items-center justify-center py-0.5">
                          <button
                            onClick={() => avail && setDate(new Date(year, month, day))}
                            disabled={!avail}
                            className={`w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors
                              ${sel ? "bg-gray-900 text-white"
                              : avail ? "hover:bg-gray-100 text-gray-900 cursor-pointer"
                              : tod ? "text-gray-400 cursor-default"
                              : "text-gray-300 cursor-default"}`}
                            aria-pressed={sel}
                          >
                            {day}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div className="w-48 shrink-0 p-4 overflow-y-auto flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-sm text-gray-900">{selDow} {selDay}</span>
                      <div className="flex gap-0.5">
                        {([false, true] as const).map(v => (
                          <button key={String(v)} onClick={() => set24h(v)}
                            className={`text-xs px-1.5 py-0.5 rounded transition-colors ${is24h===v ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600"}`}>
                            {v ? "24h" : "12h"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {displaySlots.map((slot, i) => {
                        const raw = TIME_SLOTS_24[i];
                        return (
                          <button key={raw}
                            onClick={() => { setSlot(raw); setStep("form"); }}
                            className="w-full border border-gray-200 rounded-lg py-2 text-sm text-center text-gray-700 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Form step */}
            {step === "form" && selectedDate && selectedSlot && (
              <BookingForm
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                is24h={is24h}
                onBack={() => setStep("calendar")}
                onSuccess={(name) => { setSuccessName(name); setStep("success"); }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
