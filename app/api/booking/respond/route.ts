import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/booking-admin";
import {
  bookingAcceptedClientEmail,
  bookingCustomClientEmail,
  bookingDeclinedClientEmail,
} from "@/lib/booking-email";
import { canRespondToBooking, storedBookingToPayload } from "@/lib/booking-respond";
import { verifyBookingToken } from "@/lib/booking-token";
import { getBookingById, updateBookingStatus } from "@/lib/booking-store";
import { getEmailConfigError, isEmailConfigured, sendClientConfirmation } from "@/lib/email";

type RespondAction = "accept" | "decline" | "custom";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, bookingId, action, message } = body as {
      token?: string;
      bookingId?: string;
      action?: RespondAction;
      message?: string;
    };

    if (!action || !["accept", "decline", "custom"].includes(action)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (action === "custom" && !message?.trim()) {
      return NextResponse.json({ error: "A message is required for custom responses." }, { status: 400 });
    }

    let bookingToken = token ? verifyBookingToken(token) : null;
    let stored = bookingId ? await getBookingById(bookingId) : null;

    if (!bookingToken && stored && isAdminRequest(req)) {
      bookingToken = storedBookingToPayload(stored);
    }

    if (!bookingToken) {
      return NextResponse.json({ error: "This booking link has expired or is invalid." }, { status: 403 });
    }

    if (!stored && bookingToken.bookingId && bookingToken.bookingId !== "pending") {
      stored = await getBookingById(bookingToken.bookingId);
    }

    if (stored && !canRespondToBooking(stored.status)) {
      return NextResponse.json({ error: "This booking is already closed." }, { status: 409 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json({ error: getEmailConfigError() }, { status: 503 });
    }

    const meetLink = bookingToken.meetLink?.trim() || undefined;
    const optionalMessage = message?.trim() || undefined;

    if (action === "accept") {
      await sendClientConfirmation({
        to: bookingToken.email,
        subject: "✅ Meeting confirmed — Pixiio Design Agency",
        html: bookingAcceptedClientEmail({
          name: bookingToken.name,
          service: bookingToken.service,
          dateLabel: bookingToken.dateLabel,
          slot: bookingToken.slot,
          timezone: bookingToken.timezone,
          meetLink,
          message: optionalMessage,
        }),
      });
      if (stored) await updateBookingStatus(stored.id, "accepted", optionalMessage ?? "");
    } else if (action === "decline") {
      await sendClientConfirmation({
        to: bookingToken.email,
        subject: "Update on your booking request — Pixiio Design Agency",
        html: bookingDeclinedClientEmail({
          name: bookingToken.name,
          service: bookingToken.service,
          dateLabel: bookingToken.dateLabel,
          slot: bookingToken.slot,
          timezone: bookingToken.timezone,
          message: optionalMessage,
        }),
      });
      if (stored) await updateBookingStatus(stored.id, "declined", optionalMessage ?? "");
    } else {
      await sendClientConfirmation({
        to: bookingToken.email,
        subject: "Message about your booking — Pixiio Design Agency",
        html: bookingCustomClientEmail({
          name: bookingToken.name,
          service: bookingToken.service,
          dateLabel: bookingToken.dateLabel,
          slot: bookingToken.slot,
          timezone: bookingToken.timezone,
          meetLink,
          message: message!.trim(),
        }),
      });
      if (stored) await updateBookingStatus(stored.id, "pending", message!.trim());
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[booking/respond] error:", err);
    return NextResponse.json({ error: "Failed to send response email." }, { status: 500 });
  }
}
