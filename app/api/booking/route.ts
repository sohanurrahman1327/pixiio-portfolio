import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, service, notes, guests, date, slot, timezone } = body;

    /* ── Basic validation ── */
    if (!name || !email || !service) {
      return NextResponse.json(
        { error: "Name, email and service are required." },
        { status: 400 }
      );
    }

    /* ── Check env vars are configured ── */
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD ||
        process.env.GMAIL_APP_PASSWORD === "your_16_char_app_password_here") {
      console.warn("[booking] Gmail credentials not configured in .env.local");
      return NextResponse.json(
        { error: "Email service is not configured yet. Please contact us directly at agency.pixiio@gmail.com" },
        { status: 503 }
      );
    }

    /* ── Nodemailer via Gmail SMTP ── */
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const bookingDate = date
      ? new Date(date).toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
          timeZone: "Asia/Dhaka",
        })
      : "Not specified";

    const guestList = Array.isArray(guests) && guests.length > 0
      ? guests.join(", ")
      : "None";

    /* ── Email to agency ── */
    await transporter.sendMail({
      from: `"Pixiio Booking" <${process.env.GMAIL_USER}>`,
      to: "agency.pixiio@gmail.com",
      replyTo: email,
      subject: `📅 New Booking — ${name} · ${service}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
          <div style="background:#5b5fef;padding:24px 32px;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:22px;">New Booking Request</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">Pixiio Design Agency</p>
          </div>
          <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;font-weight:600;"><a href="mailto:${email}" style="color:#5b5fef;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Service</td><td style="padding:8px 0;font-weight:600;">${service}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Date</td><td style="padding:8px 0;font-weight:600;">${bookingDate}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Time</td><td style="padding:8px 0;font-weight:600;">${slot ?? "Not specified"} (${timezone ?? "Asia/Dhaka"})</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Guests</td><td style="padding:8px 0;">${guestList}</td></tr>
              ${notes ? `<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Notes</td><td style="padding:8px 0;">${notes}</td></tr>` : ""}
            </table>
          </div>
        </div>
      `,
    });

    /* ── Confirmation email to client ── */
    await transporter.sendMail({
      from: `"Pixiio Design Agency" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `✅ Booking received — Pixiio Design Agency`,
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
              <p style="margin:4px 0;font-size:14px;"><strong>Time:</strong> ${slot ?? "To be confirmed"} <span style="color:#6b7280;">(${timezone ?? "Asia/Dhaka"})</span></p>
            </div>
            <p style="font-size:14px;color:#374151;line-height:1.6;">
              Have questions? Reply to this email or message us on
              <a href="https://wa.me/8801346064215" style="color:#5b5fef;">WhatsApp</a>.
            </p>
            <p style="font-size:14px;color:#374151;margin-top:24px;">— The Pixiio Team</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("[booking/route] error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please contact us directly at agency.pixiio@gmail.com" },
      { status: 500 }
    );
  }
}
