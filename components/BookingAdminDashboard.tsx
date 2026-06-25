"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import BookingRespondForm from "@/components/BookingRespondForm";
import type { BookingStatus, StoredBooking } from "@/lib/booking-types";
import { canRespondToBooking, formatBookingSerial, storedBookingToPayload } from "@/lib/booking-respond";

type TabId = "all" | "pending" | "accepted" | "declined" | "completed";

interface DashboardStats {
  total: number;
  pending: number;
  accepted: number;
  completed: number;
  declined: number;
}

const fetchOpts: RequestInit = { credentials: "include" };

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
  const [inputKey, setInputKey] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginHint, setLoginHint] = useState("");
  const [tab, setTab] = useState<TabId>("all");
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
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

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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
    if (!inputKey.trim()) return;
    setLoginError("");
    setLoginHint("");

    try {
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
      setAuthenticated(true);
      setInputKey("");
      await loadBookings();
    } catch {
      setLoginError("Could not verify admin secret. Please try again.");
    }
  }

  async function handleLogout() {
    await fetch("/api/booking/admin/auth", { method: "DELETE", credentials: "include" });
    setAuthenticated(false);
    setBookings([]);
    setStats(null);
    setError("");
  }

  if (authenticated === null && loading) {
    return <p className="text-sm text-gray-500">Checking admin access…</p>;
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-surface-elevated p-8 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Admin access</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Bookings dashboard</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your booking admin secret to view meeting requests, accepted bookings, and completed meetings.
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="password"
            value={inputKey}
            onChange={(e) => {
              setInputKey(e.target.value);
              if (loginError) setLoginError("");
            }}
            placeholder="Admin secret key"
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-primary"
          />
          {loginError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{loginError}</p>
          )}
          {loginHint && <p className="text-xs text-gray-500">{loginHint}</p>}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Unlock dashboard
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-400">
          Tip: set <code className="rounded bg-gray-100 px-1 py-0.5">BOOKING_ADMIN_SECRET=your-password</code> in `.env.local` and use that password here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Admin dashboard</p>
          <h1 className="mt-2 font-display text-4xl tracking-wide text-gray-900">Meeting bookings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track all join requests, accepted meetings, declined requests, and completed sessions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadBookings}
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
    </div>
  );
}
