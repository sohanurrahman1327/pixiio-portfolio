"use client";

import { useState } from "react";
import type { BookingTokenPayload } from "@/lib/booking-token";

type Action = "accept" | "decline" | "custom";

export default function BookingRespondForm({
  token,
  bookingId,
  booking,
  inline = false,
  onDone,
  onCancel,
}: {
  token?: string;
  bookingId: string;
  booking: BookingTokenPayload;
  inline?: boolean;
  onDone?: (action: Action) => void;
  onCancel?: () => void;
}) {
  const [action, setAction] = useState<Action>("accept");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (action === "custom" && !message.trim()) {
      setError("Please write a message for the client.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/booking/respond", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          bookingId,
          action,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send response");
      setDone(true);
      onDone?.(action);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        className={
          inline
            ? "mt-4 rounded-xl border border-[#188038]/20 bg-[#f6fff8] px-4 py-3"
            : "rounded-2xl border border-[#188038]/20 bg-[#f6fff8] p-8 text-center"
        }
      >
        <div className={inline ? "flex flex-wrap items-start justify-between gap-3" : undefined}>
          <div className={inline ? undefined : undefined}>
            <p className={`font-semibold text-[#188038] ${inline ? "text-sm" : "text-lg"}`}>
              Response sent successfully
            </p>
            <p className={`text-gray-600 ${inline ? "mt-1 text-xs" : "mt-2 text-sm"}`}>
              An email has been sent to <strong>{booking.email}</strong>.
            </p>
          </div>
          {inline && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  const actions: { id: Action; label: string; description: string; tone: string }[] = [
    {
      id: "accept",
      label: "Accept",
      description: "Confirm the meeting and notify the client.",
      tone: "border-[#188038]/30 bg-[#f6fff8] text-[#188038]",
    },
    {
      id: "decline",
      label: "Decline",
      description: "Decline this slot and notify the client.",
      tone: "border-gray-300 bg-gray-50 text-gray-700",
    },
    {
      id: "custom",
      label: "Custom message",
      description: "Send your own message about this booking.",
      tone: "border-primary/30 bg-primary/5 text-primary",
    },
  ];

  const form = (
    <form onSubmit={handleSubmit} className={inline ? undefined : "rounded-2xl border border-gray-100 bg-surface-elevated p-6 shadow-sm"}>
      {!inline && (
        <>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Your response</p>
          <h3 className="mt-2 text-xl font-bold text-gray-900">Accept, decline, or send a message</h3>
        </>
      )}

      <div className={inline ? "grid gap-3" : "mt-5 grid gap-3"}>
        {actions.map(({ id, label, description, tone }) => {
          const selected = action === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setAction(id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                selected ? `${tone} ring-2 ring-primary/20` : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="block text-sm font-semibold">{label}</span>
              <span className="mt-1 block text-xs text-gray-500">{description}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <label htmlFor={`response-message-${bookingId}`} className="block text-sm font-medium text-gray-900">
          {action === "custom" ? "Message to client *" : "Optional note"}
        </label>
        <textarea
          id={`response-message-${bookingId}`}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError("");
          }}
          rows={inline ? 4 : 5}
          placeholder={
            action === "accept"
              ? "Add any extra details for the client (optional)."
              : action === "decline"
                ? "Explain why this slot is unavailable (optional)."
                : "Write your message to the client."
          }
          className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
      )}

      <div className={`flex flex-wrap gap-2 ${inline ? "mt-4" : "mt-5"}`}>
        <button
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 ${
            inline ? "px-4 py-2 text-xs" : "w-full"
          }`}
        >
          {submitting ? "Sending…" : "Send response to client"}
        </button>
        {inline && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  if (inline) {
    return (
      <div className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Respond to client</p>
            <p className="text-xs text-gray-500">Accept, decline, or send a custom message</p>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
          )}
        </div>
        {form}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <section className="rounded-2xl border border-gray-100 bg-surface-elevated p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Request details</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">{booking.name}</h2>
        <p className="mt-1 text-sm text-gray-500">{booking.email}</p>
        {booking.phone && <p className="text-sm text-gray-500">{booking.phone}</p>}

        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service</dt>
            <dd className="mt-1 font-medium text-gray-900">{booking.service}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date & time</dt>
            <dd className="mt-1 font-medium text-gray-900">
              {booking.dateLabel}
              <span className="block text-gray-600">
                {booking.slot} ({booking.timezone.replace(/_/g, " ")})
              </span>
            </dd>
          </div>
          {booking.guests && booking.guests !== "None" && (
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Guests</dt>
              <dd className="mt-1 font-medium text-gray-900">{booking.guests}</dd>
            </div>
          )}
          {booking.meetLink && (
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Google Meet</dt>
              <dd className="mt-1 break-all font-medium text-primary">
                <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {booking.meetLink}
                </a>
              </dd>
            </div>
          )}
          {booking.notes && (
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap text-gray-700">{booking.notes}</dd>
            </div>
          )}
        </dl>
      </section>

      {form}
    </div>
  );
}
