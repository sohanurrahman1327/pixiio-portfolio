import { NextRequest, NextResponse } from "next/server";
import {
  agencyEmailHtml,
  getEmailConfigError,
  isEmailConfigured,
  sendAgencyEmail,
  sendClientConfirmation,
} from "@/lib/email";
import { bookingRespondActionsHtml } from "@/lib/booking-email";
import { createBookingToken } from "@/lib/booking-token";
import { createBooking, dateKeyFromIso, updateBookingRespondToken } from "@/lib/booking-store";
import { CONTACT_EMAIL, GOOGLE_MEET_LINK } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/site-url";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      service,
      notes,
      guests,
      date,
      slot,
      slotKey,
      timezone,
      meetLink: submittedMeetLink,
    } = body;

    if (!name || !email || !phone || !service || !slotKey) {
      return NextResponse.json(
        { error: "Name, email, phone, service and time slot are required." },
        { status: 400 }
      );
    }

    if (!isEmailConfigured()) {
      console.warn("[booking] Gmail credentials not configured in .env.local");
      return NextResponse.json(
        { error: getEmailConfigError(), fallback: "mailto" },
        { status: 503 }
      );
    }

    const bookingDate = date
      ? new Date(date).toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
          timeZone: "Asia/Dhaka",
        })
      : "Not specified";

    const guestList = Array.isArray(guests) && guests.length > 0
      ? guests.join(", ")
      : "None";

    const meetLink =
      typeof submittedMeetLink === "string" && submittedMeetLink.trim()
        ? submittedMeetLink.trim()
        : GOOGLE_MEET_LINK.trim();

    const dateKey = date ? dateKeyFromIso(date) : "unknown";
    const slotLabel = slot ?? slotKey;

    const respondToken = createBookingToken({
      bookingId: "pending",
      name,
      email,
      phone,
      service,
      notes: notes ?? "",
      guests: guestList,
      dateLabel: bookingDate,
      slot: slotLabel,
      timezone: timezone ?? "Asia/Dhaka",
      meetLink,
    });

    let booking;
    try {
      booking = await createBooking({
        name,
        email,
        phone,
        service,
        notes: notes ?? "",
        guests: guestList,
        dateKey,
        dateLabel: bookingDate,
        slotKey,
        slotLabel,
        timezone: timezone ?? "Asia/Dhaka",
        meetLink,
        respondToken,
      });
    } catch (err) {
      if (err instanceof Error && err.message === "SLOT_TAKEN") {
        return NextResponse.json(
          { error: "This time slot has already been booked. Please choose another time." },
          { status: 409 }
        );
      }
      throw err;
    }

    const finalToken = createBookingToken({
      bookingId: booking.id,
      name,
      email,
      phone,
      service,
      notes: notes ?? "",
      guests: guestList,
      dateLabel: bookingDate,
      slot: slotLabel,
      timezone: timezone ?? "Asia/Dhaka",
      meetLink,
    });

    await updateBookingRespondToken(booking.id, finalToken);

    const rows = [
      { label: "Name", value: name },
      { label: "Email", value: `<a href="mailto:${email}" style="color:#5b5fef;">${email}</a>` },
      { label: "Phone", value: phone },
      { label: "Service", value: service },
      { label: "Date", value: bookingDate },
      { label: "Time", value: `${slotLabel} (${timezone ?? "Asia/Dhaka"})` },
      { label: "Guests", value: guestList },
    ];
    if (notes) rows.push({ label: "Notes", value: notes.replace(/\n/g, "<br>") });
    if (meetLink) {
      rows.push({
        label: "Google Meet",
        value: `<a href="${meetLink}" style="color:#5b5fef;">${meetLink}</a>`,
      });
    }

    const respondUrl = `${getSiteUrl()}/admin/bookings/respond?token=${encodeURIComponent(finalToken)}`;
    const dashboardUrl = `${getSiteUrl()}/admin/bookings`;

    await sendAgencyEmail({
      subject: `📅 Meeting Schedule Requested — ${name} · ${service}`,
      html:
        agencyEmailHtml("Meeting Schedule Requested", rows) +
        bookingRespondActionsHtml(respondUrl, dashboardUrl),
      replyTo: email,
    });

    await sendClientConfirmation({
      to: email,
      subject: "✅ Booking received — Pixiio Design Agency",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
          <div style="background:#5b5fef;padding:24px 32px;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:22px;">Booking Received!</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">We'll confirm your slot shortly.</p>
          </div>
          <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
            <p style="font-size:15px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size:14px;color:#374151;line-height:1.6;">
              Thank you for booking a discovery call with <strong>Pixiio Design Agency</strong>.
              We've received your request and will confirm your slot within a few hours via email or WhatsApp.
            </p>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin:20px 0;">
              <p style="margin:0 0 10px;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Your booking details</p>
              <p style="margin:4px 0;font-size:14px;"><strong>Service:</strong> ${service}</p>
              <p style="margin:4px 0;font-size:14px;"><strong>Date:</strong> ${bookingDate}</p>
              <p style="margin:4px 0;font-size:14px;"><strong>Time:</strong> ${slotLabel} <span style="color:#6b7280;">(${timezone ?? "Asia/Dhaka"})</span></p>
              ${meetLink ? `<p style="margin:4px 0;font-size:14px;"><strong>Google Meet:</strong> <a href="${meetLink}" style="color:#5b5fef;">${meetLink}</a></p>` : ""}
            </div>
            <p style="font-size:14px;color:#374151;line-height:1.6;">
              Have questions? Reply to this email or message us on
              <a href="${buildWhatsAppUrl()}" style="color:#5b5fef;">WhatsApp</a>.
            </p>
            <p style="font-size:14px;color:#374151;margin-top:24px;">— The Pixiio Team</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err) {
    console.error("[booking/route] error:", err);
    return NextResponse.json(
      { error: `Failed to send email. Please contact us directly at ${CONTACT_EMAIL}`, fallback: "mailto" },
      { status: 500 }
    );
  }
}
