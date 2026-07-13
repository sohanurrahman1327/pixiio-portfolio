"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import BookingRespondForm from "@/components/BookingRespondForm";
import type { BookingStatus, StoredBooking } from "@/lib/booking-types";
import type { StoredContactInquiry, StoredSubscriber } from "@/lib/inbox-types";
import { canRespondToBooking, formatBookingSerial, storedBookingToPayload } from "@/lib/booking-respond";

type PanelId = "meeting" | "subscriber" | "contact";
type TabId = "all" | "pending" | "accepted" | "declined" | "completed";

interface DashboardStats {
  total: number;
  pending: number;
  accepted: number;
  completed: number;
  declined: number;
}

const fetchOpts: RequestInit = { credentials: "include" };

const PANELS: { id: PanelId; label: string; hint: string }[] = [
  { id: "meeting", label: "Meeting", hint: "Let's Talk bookings" },
  { id: "subscriber", label: "Subscriber", hint: "Newsletter signups" },
  { id: "contact", label: "Contact", hint: "Contact form inquiries" },
];


function statusBadge(status: BookingStatus) {
  const styles: Record<BookingStatus, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    declined: "bg-gray-100 text-gray-600 border-gray-200",
    completed: "bg-primary/10 text-primary border-primary/20",
  };
  return styles[status];
}

function BookingMessageComposer({
  booking,
  onSent,
  onCancel,
}: {
  booking: StoredBooking;
  onSent: () => void;
  onCancel: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState(booking.meetLink || "");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleFiles(selected: FileList | null) {
    if (!selected) return;
    setFiles((prev) => [...prev, ...Array.from(selected)].slice(0, 5));
    setError("");
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      setError("Write a message before sending.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("bookingId", booking.id);
      formData.append("message", message.trim());
      if (subject.trim()) formData.append("subject", subject.trim());
      if (link.trim()) formData.append("link", link.trim());
      files.forEach((file) => formData.append("attachments", file));

      const res = await fetch("/api/booking/admin/message", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setDone(true);
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="mt-4 rounded-xl border border-[#188038]/20 bg-[#f6fff8] px-4 py-3 text-sm text-[#188038]">
        Message sent to <strong>{booking.email}</strong> from your Pixiio Gmail.
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Send message to client</p>
          <p className="text-xs text-gray-500">Sent from {booking.email ? `agency Gmail → ${booking.email}` : "agency Gmail"}</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          Close
        </button>
      </div>

      <div className="grid gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Subject (optional)</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={`Message from Pixiio — ${booking.service}`}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Message *</label>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError("");
            }}
            rows={5}
            placeholder="Write your message to the client…"
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Link (optional)</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://meet.google.com/… or any useful link"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Attachments (optional)</label>
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
            onChange={(e) => handleFiles(e.target.files)}
            className="block w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-primary-dark"
          />
          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-gray-700">
                  <span className="truncate">{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="shrink-0 text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-1 text-[11px] text-gray-400">Images, PDF, DOC, XLS, TXT, ZIP · max 5 files · 5 MB each</p>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send from Gmail"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function formatDhakaDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function AnalysisField({
  label,
  value,
  empty = "Not provided",
}: {
  label: string;
  value?: string | null;
  empty?: string;
}) {
  const trimmed = value?.trim() ?? "";
  const isEmpty = !trimmed || trimmed === "None";

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`mt-1 text-sm ${isEmpty ? "italic text-gray-400" : "font-medium text-gray-900"}`}>
        {isEmpty ? empty : trimmed}
      </p>
    </div>
  );
}

function MeetingAnalysisPanel({
  booking,
  onClose,
}: {
  booking: StoredBooking;
  onClose: () => void;
}) {
  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Meeting analysis</p>
          <p className="text-xs text-gray-500">Everything the client shared for this completed meeting</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          Close
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Client details</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnalysisField label="Full name" value={booking.name} />
            <AnalysisField label="Email" value={booking.email} />
            <AnalysisField label="Phone" value={booking.phone} />
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Meeting request</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnalysisField label="Service" value={booking.service} />
            <AnalysisField label="Preferred date" value={booking.dateLabel} />
            <AnalysisField label="Preferred time" value={booking.slotLabel} />
            <AnalysisField label="Timezone" value={booking.timezone.replace(/_/g, " ")} />
            <AnalysisField label="Guest emails" value={booking.guests} empty="No guests added" />
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Client notes</h4>
          <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-3">
            {booking.notes.trim() ? (
              <p className="whitespace-pre-wrap text-sm text-gray-800">{booking.notes}</p>
            ) : (
              <p className="text-sm italic text-gray-400">Client did not add any notes.</p>
            )}
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Meeting record</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnalysisField label="Summary" value={booking.summary} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Google Meet</p>
              {booking.meetLink.trim() ? (
                <a
                  href={booking.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-sm font-medium text-primary hover:underline"
                >
                  {booking.meetLink}
                </a>
              ) : (
                <p className="mt-1 text-sm italic text-gray-400">No meet link recorded</p>
              )}
            </div>
            <AnalysisField label="Request submitted" value={formatDhakaDateTime(booking.createdAt)} empty="" />
            <AnalysisField label="Last updated" value={formatDhakaDateTime(booking.updatedAt)} empty="" />
            <AnalysisField label="Booking ID" value={booking.id} empty="" />
          </div>
        </section>

        {booking.adminMessage.trim() && (
          <section>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Admin follow-up</h4>
            <div className="rounded-lg border border-primary/10 bg-primary/[0.03] px-4 py-3">
              <p className="whitespace-pre-wrap text-sm text-gray-800">{booking.adminMessage}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ActionNotice({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="mt-4 flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[#188038]/20 bg-[#f6fff8] px-4 py-3">
      <p className="text-sm text-[#188038]">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  serial,
  onRefresh,
}: {
  booking: StoredBooking;
  serial: number;
  onRefresh: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showRespond, setShowRespond] = useState(false);
  const [respondLocked, setRespondLocked] = useState(false);
  const [completedLocally, setCompletedLocally] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const canRespond = canRespondToBooking(booking.status) && !respondLocked;
  const isCompleted = booking.status === "completed";

  function closePanels(except?: "message" | "analysis" | "respond") {
    if (except !== "message") setShowMessage(false);
    if (except !== "analysis") setShowAnalysis(false);
    if (except !== "respond") setShowRespond(false);
  }

  async function markCompleted() {
    setBusy(true);
    try {
      const res = await fetch("/api/booking/admin", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id, status: "completed" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
      setCompletedLocally(true);
      setActionNotice(`Meeting marked as complete for ${booking.name}. Refresh the dashboard to update tabs and counts.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border border-gray-100 bg-surface-elevated p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 px-2 text-xs font-bold text-white"
            aria-label={`Booking number ${serial}`}
          >
            {formatBookingSerial(serial)}
          </span>
          <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{booking.name}</h3>
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusBadge(booking.status)}`}>
              {booking.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{booking.summary}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !showMessage;
              closePanels(next ? "message" : undefined);
              setShowMessage(next);
            }}
            className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              showMessage
                ? "bg-primary text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:text-primary"
            }`}
          >
            Message
          </button>
          {canRespond && (
            <button
              type="button"
              onClick={() => {
                const next = !showRespond;
                closePanels(next ? "respond" : undefined);
                setShowRespond(next);
              }}
              className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                showRespond
                  ? "bg-primary text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:text-primary"
              }`}
            >
              Respond
            </button>
          )}
          {isCompleted && (
            <button
              type="button"
              onClick={() => {
                const next = !showAnalysis;
                closePanels(next ? "analysis" : undefined);
                setShowAnalysis(next);
              }}
              className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                showAnalysis
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              Meeting Analysis
            </button>
          )}
          {booking.status === "accepted" && !completedLocally && (
            <button
              type="button"
              disabled={busy}
              onClick={markCompleted}
              className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {busy ? "Saving…" : "Mark meeting complete"}
            </button>
          )}
        </div>
      </div>

      {showMessage && (
        <BookingMessageComposer
          booking={booking}
          onSent={onRefresh}
          onCancel={() => setShowMessage(false)}
        />
      )}

      {showRespond && (
        <BookingRespondForm
          inline
          bookingId={booking.id}
          booking={storedBookingToPayload(booking)}
          onDone={(action) => {
            setRespondLocked(true);
            const label =
              action === "accept"
                ? "Accepted"
                : action === "decline"
                  ? "Declined"
                  : "Custom message sent";
            setActionNotice(
              `${label} — email sent to ${booking.email}. Refresh the dashboard to update tabs and counts.`,
            );
          }}
          onCancel={() => setShowRespond(false)}
        />
      )}

      {actionNotice && !showRespond && (
        <ActionNotice message={actionNotice} onDismiss={() => setActionNotice(null)} />
      )}

      {showAnalysis && (
        <MeetingAnalysisPanel booking={booking} onClose={() => setShowAnalysis(false)} />
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Client</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{booking.email}</p>
          <p className="text-sm text-gray-600">{booking.phone || "No phone provided"}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Meeting</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{booking.dateLabel}</p>
          <p className="text-sm text-gray-600">
            {booking.slotLabel} ({booking.timezone.replace(/_/g, " ")})
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{booking.service}</p>
          {booking.guests && booking.guests !== "None" && (
            <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
          )}
        </div>
      </div>

      {(booking.meetLink || booking.notes || booking.adminMessage) && (
        <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4">
          {booking.meetLink && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Google Meet</p>
              <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-sm font-medium text-primary hover:underline">
                {booking.meetLink}
              </a>
            </div>
          )}
          {booking.notes && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Additional notes</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{booking.notes}</p>
            </div>
          )}
          {booking.adminMessage && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Admin message</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{booking.adminMessage}</p>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-[11px] text-gray-400">
        Requested {new Date(booking.createdAt).toLocaleString("en-US", { timeZone: "Asia/Dhaka" })}
      </p>
    </article>
  );
}

export default function BookingAdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loginStep, setLoginStep] = useState<"password" | "totp" | "setup">("password");
  const [inputKey, setInputKey] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [setupQrUrl, setSetupQrUrl] = useState("");
  const [setupSecret, setSetupSecret] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginHint, setLoginHint] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [panel, setPanel] = useState<PanelId>("meeting");
  const [tab, setTab] = useState<TabId>("all");
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subscribers, setSubscribers] = useState<StoredSubscriber[]>([]);
  const [subscriberTotal, setSubscriberTotal] = useState(0);
  const [contacts, setContacts] = useState<StoredContactInquiry[]>([]);
  const [contactTotal, setContactTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/booking/admin", fetchOpts);
      const data = await res.json();
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Failed to load bookings");
      setAuthenticated(true);
      setBookings(data.bookings);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
      setBookings([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/booking/admin/subscribers", fetchOpts);
      const data = await res.json();
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Failed to load subscribers");
      setAuthenticated(true);
      setSubscribers(data.subscribers ?? []);
      setSubscriberTotal(data.stats?.total ?? data.subscribers?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscribers");
      setSubscribers([]);
      setSubscriberTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/booking/admin/contacts", fetchOpts);
      const data = await res.json();
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Failed to load contacts");
      setAuthenticated(true);
      setContacts(data.contacts ?? []);
      setContactTotal(data.stats?.total ?? data.contacts?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts");
      setContacts([]);
      setContactTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPanel = useCallback(async () => {
    if (panel === "meeting") await loadBookings();
    else if (panel === "subscriber") await loadSubscribers();
    else await loadContacts();
  }, [panel, loadBookings, loadSubscribers, loadContacts]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    if (!authenticated) return;
    if (panel === "meeting") loadBookings();
    else if (panel === "subscriber") loadSubscribers();
    else loadContacts();
  }, [panel, authenticated, loadBookings, loadSubscribers, loadContacts]);

  const filtered = useMemo(() => {
    if (tab === "pending") return bookings.filter((b) => b.status === "pending");
    if (tab === "accepted") return bookings.filter((b) => b.status === "accepted");
    if (tab === "declined") return bookings.filter((b) => b.status === "declined");
    if (tab === "completed") return bookings.filter((b) => b.status === "completed");
    return bookings;
  }, [bookings, tab]);

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "all", label: "All requests", count: stats?.total ?? 0 },
    { id: "pending", label: "Pending", count: stats?.pending ?? 0 },
    { id: "accepted", label: "Accepted", count: stats?.accepted ?? 0 },
    { id: "declined", label: "Declined", count: stats?.declined ?? 0 },
    { id: "completed", label: "Completed meetings", count: stats?.completed ?? 0 },
  ];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginHint("");
    setLoginBusy(true);

    try {
      if (loginStep === "password") {
        if (!inputKey.trim()) {
          setLoginError("Enter your admin secret.");
          return;
        }

        const res = await fetch("/api/booking/admin/auth", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: inputKey.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setLoginError(data.error || "Invalid admin secret.");
          setLoginHint(data.hint || "");
          return;
        }

        if (data.requires2faSetup) {
          setSetupQrUrl(data.qrUrl || "");
          setSetupSecret(data.secret || "");
          setLoginStep("setup");
          setTotpCode("");
          return;
        }

        if (data.requires2fa) {
          setLoginStep("totp");
          setTotpCode("");
          return;
        }

        setAuthenticated(true);
        setInputKey("");
        await loadBookings();
        return;
      }

      if (!totpCode.trim()) {
        setLoginError("Enter the 6-digit authenticator code.");
        return;
      }

      const res = await fetch("/api/booking/admin/auth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-2fa", totp: totpCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Invalid authenticator code.");
        return;
      }

      setAuthenticated(true);
      setInputKey("");
      setTotpCode("");
      setSetupQrUrl("");
      setSetupSecret("");
      setLoginStep("password");
      await loadBookings();
    } catch {
      setLoginError(
        loginStep === "password"
          ? "Could not verify admin secret. Please try again."
          : "Could not verify authenticator code. Please try again."
      );
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/booking/admin/auth", { method: "DELETE", credentials: "include" });
    setAuthenticated(false);
    setLoginStep("password");
    setTotpCode("");
    setSetupQrUrl("");
    setSetupSecret("");
    setBookings([]);
    setStats(null);
    setSubscribers([]);
    setContacts([]);
    setError("");
  }

  if (authenticated === null && loading) {
    return <p className="text-sm text-gray-500">Checking admin access…</p>;
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-surface-elevated p-8 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Admin access</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Admin dashboard</h2>
        <p className="mt-2 text-sm text-gray-600">
          {loginStep === "password"
            ? "Enter your admin secret, then confirm with Google Authenticator."
            : loginStep === "setup"
              ? "Scan the QR code with Google Authenticator, then enter the 6-digit code to finish setup."
              : "Enter the 6-digit code from Google Authenticator."}
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {loginStep === "password" && (
            <input
              type="password"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                if (loginError) setLoginError("");
              }}
              placeholder="Admin secret key"
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-primary"
            />
          )}

          {loginStep === "setup" && (
            <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              {setupQrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={setupQrUrl}
                  alt="Google Authenticator QR code"
                  width={220}
                  height={220}
                  className="mx-auto rounded-lg bg-white p-2"
                />
              ) : null}
              <p className="text-center text-xs text-gray-500">
                Can&apos;t scan? Add this key manually in Google Authenticator:
              </p>
              <code className="block break-all rounded-lg bg-white px-3 py-2 text-center text-xs font-semibold tracking-wider text-gray-800">
                {setupSecret}
              </code>
            </div>
          )}

          {(loginStep === "totp" || loginStep === "setup") && (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={totpCode}
              onChange={(e) => {
                setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                if (loginError) setLoginError("");
              }}
              placeholder="6-digit authenticator code"
              autoComplete="one-time-code"
              autoFocus
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-center text-lg font-semibold tracking-[0.35em] text-gray-900 outline-none focus:border-primary"
            />
          )}

          {loginError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{loginError}</p>
          )}
          {loginHint && <p className="text-xs text-gray-500">{loginHint}</p>}

          <button
            type="submit"
            disabled={loginBusy}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {loginBusy
              ? "Verifying…"
              : loginStep === "password"
                ? "Continue"
                : loginStep === "setup"
                  ? "Confirm & unlock"
                  : "Verify & unlock"}
          </button>

          {loginStep !== "password" && (
            <button
              type="button"
              onClick={() => {
                setLoginStep("password");
                setTotpCode("");
                setSetupQrUrl("");
                setSetupSecret("");
                setLoginError("");
              }}
              className="w-full text-center text-xs font-medium text-gray-500 hover:text-gray-800"
            >
              ← Back to password
            </button>
          )}
        </form>

        <p className="mt-4 text-xs text-gray-400">
          Tip: password is <code className="rounded bg-gray-100 px-1 py-0.5">BOOKING_ADMIN_SECRET</code>.
          First login sets up Google Authenticator 2FA automatically.
        </p>
      </div>
    );
  }

  const panelMeta =
    panel === "meeting"
      ? {
          title: "Meeting bookings",
          description: "Track Let's Talk join requests, accepted meetings, declined requests, and completed sessions.",
        }
      : panel === "subscriber"
        ? {
            title: "Subscribers",
            description: "Newsletter signups from the site footer — Pixiio subscribe / mailing list entries.",
          }
        : {
            title: "Contact inquiries",
            description: "Project requests submitted through the Contact Us form.",
          };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-56">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Dashboard</p>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {PANELS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPanel(item.id)}
              className={`min-w-[8.5rem] rounded-xl px-4 py-3 text-left transition-colors lg:min-w-0 ${
                panel === item.id
                  ? "bg-primary text-white shadow-sm"
                  : "border border-gray-100 bg-surface-elevated text-gray-700 hover:border-primary/20 hover:text-primary"
              }`}
            >
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className={`mt-0.5 block text-[11px] ${panel === item.id ? "text-white/75" : "text-gray-400"}`}>
                {item.hint}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Admin dashboard</p>
            <h1 className="mt-2 font-display text-4xl tracking-wide text-gray-900">{panelMeta.title}</h1>
            <p className="mt-2 text-sm text-gray-600">{panelMeta.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={refreshPanel}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:opacity-60"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Log out
            </button>
          </div>
        </div>

        {panel === "meeting" && (
          <>
            <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { label: "Total requests", value: stats?.total ?? 0 },
                { label: "Pending", value: stats?.pending ?? 0 },
                { label: "Accepted", value: stats?.accepted ?? 0 },
                { label: "Declined", value: stats?.declined ?? 0 },
                { label: "Completed", value: stats?.completed ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-surface-elevated px-4 py-3 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-100">
              {tabs.map(({ id, label, count }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                    tab === id
                      ? "relative z-10 -mb-px border-b-2 border-primary bg-background text-primary"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {label}
                  <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">{count}</span>
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading bookings…</p>
            ) : error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-surface-elevated p-10 text-center">
                <p className="text-sm text-gray-500">No bookings in this tab yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filtered.map((booking, index) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    serial={index + 1}
                    onRefresh={loadBookings}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {panel === "subscriber" && (
          <>
            <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-surface-elevated px-4 py-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total subscribers</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{subscriberTotal}</p>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading subscribers…</p>
            ) : error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            ) : subscribers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-surface-elevated p-10 text-center">
                <p className="text-sm text-gray-500">No newsletter subscribers yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-surface-elevated shadow-sm">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/80 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-4 py-3 text-gray-400">{formatBookingSerial(index + 1)}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <a href={`mailto:${item.email}`} className="hover:text-primary hover:underline">
                            {item.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 capitalize text-gray-600">{item.source}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDhakaDateTime(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {panel === "contact" && (
          <>
            <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-surface-elevated px-4 py-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total inquiries</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{contactTotal}</p>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading contact inquiries…</p>
            ) : error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            ) : contacts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-surface-elevated p-10 text-center">
                <p className="text-sm text-gray-500">No contact form submissions yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {contacts.map((item, index) => (
                  <article key={item.id} className="rounded-2xl border border-gray-100 bg-surface-elevated p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 px-2 text-xs font-bold text-white">
                          {formatBookingSerial(index + 1)}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                          <a href={`mailto:${item.email}`} className="mt-1 block text-sm text-primary hover:underline">
                            {item.email}
                          </a>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{formatDhakaDateTime(item.createdAt)}</p>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{item.project}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Budget</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{item.budget}</p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Message</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{item.message}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

