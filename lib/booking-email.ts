import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function bookingRespondActionsHtml(respondUrl: string, dashboardUrl?: string) {
  return `
    <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
        Meeting schedule requested
      </p>
      <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
        Accept, decline, or send a custom message to the client from one place.
      </p>
      <a
        href="${respondUrl}"
        style="display:inline-block;background:#5b5fef;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin-right:8px;"
      >
        Open booking response form
      </a>
      ${
        dashboardUrl
          ? `<a
        href="${dashboardUrl}"
        style="display:inline-block;background:#111827;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;"
      >
        Open bookings dashboard
      </a>`
          : ""
      }
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMessageBlock(message?: string) {
  if (!message?.trim()) return "";
  return `
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap;">${linkifyMessage(message.trim())}</p>
    </div>
  `;
}

function linkifyMessage(message: string) {
  const escaped = escapeHtml(message);
  return escaped
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#5b5fef;">$1</a>')
    .replace(/\n/g, "<br>");
}

export function bookingDirectMessageEmail(data: {
  name: string;
  message: string;
  link?: string;
  service: string;
  dateLabel: string;
  slot: string;
}) {
  const linkBlock = data.link?.trim()
    ? `<p style="margin:16px 0 0;font-size:14px;"><a href="${escapeHtml(data.link.trim())}" style="color:#5b5fef;font-weight:600;">${escapeHtml(data.link.trim())}</a></p>`
    : "";

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <div style="background:#5b5fef;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Message from Pixiio</h1>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">Regarding your booking request</p>
      </div>
      <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
        <p style="font-size:15px;">Hi <strong>${escapeHtml(data.name)}</strong>,</p>
        ${formatMessageBlock(data.message)}
        ${linkBlock}
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 10px;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Booking reference</p>
          <p style="margin:4px 0;font-size:14px;"><strong>Service:</strong> ${escapeHtml(data.service)}</p>
          <p style="margin:4px 0;font-size:14px;"><strong>Date:</strong> ${escapeHtml(data.dateLabel)}</p>
          <p style="margin:4px 0;font-size:14px;"><strong>Time:</strong> ${escapeHtml(data.slot)}</p>
        </div>
        <p style="font-size:14px;color:#374151;line-height:1.6;">
          Reply to this email if you have any questions, or message us on
          <a href="${buildWhatsAppUrl()}" style="color:#5b5fef;">WhatsApp</a>.
        </p>
        <p style="font-size:14px;color:#374151;margin-top:24px;">— The Pixiio Team</p>
      </div>
    </div>
  `;
}

function bookingDetailsBlock(booking: {
  service: string;
  dateLabel: string;
  slot: string;
  timezone: string;
  meetLink?: string;
}) {
  return `
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 10px;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Booking details</p>
      <p style="margin:4px 0;font-size:14px;"><strong>Service:</strong> ${escapeHtml(booking.service)}</p>
      <p style="margin:4px 0;font-size:14px;"><strong>Date:</strong> ${escapeHtml(booking.dateLabel)}</p>
      <p style="margin:4px 0;font-size:14px;"><strong>Time:</strong> ${escapeHtml(booking.slot)} <span style="color:#6b7280;">(${escapeHtml(booking.timezone)})</span></p>
      ${
        booking.meetLink
          ? `<p style="margin:4px 0;font-size:14px;"><strong>Google Meet:</strong> <a href="${escapeHtml(booking.meetLink)}" style="color:#5b5fef;">${escapeHtml(booking.meetLink)}</a></p>`
          : ""
      }
    </div>
  `;
}

export function bookingAcceptedClientEmail(data: {
  name: string;
  service: string;
  dateLabel: string;
  slot: string;
  timezone: string;
  meetLink?: string;
  message?: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <div style="background:#188038;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Meeting Confirmed</h1>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">Your discovery call is scheduled.</p>
      </div>
      <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
        <p style="font-size:15px;">Hi <strong>${escapeHtml(data.name)}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.6;">
          Great news — your meeting request with <strong>Pixiio Design Agency</strong> has been accepted.
        </p>
        ${bookingDetailsBlock(data)}
        ${formatMessageBlock(data.message)}
        <p style="font-size:14px;color:#374151;line-height:1.6;">
          Need to reschedule? Reply to this email or message us on
          <a href="${buildWhatsAppUrl()}" style="color:#5b5fef;">WhatsApp</a>.
        </p>
        <p style="font-size:14px;color:#374151;margin-top:24px;">— The Pixiio Team</p>
      </div>
    </div>
  `;
}

export function bookingDeclinedClientEmail(data: {
  name: string;
  service: string;
  dateLabel: string;
  slot: string;
  timezone: string;
  message?: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <div style="background:#374151;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Booking Update</h1>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">Regarding your meeting request</p>
      </div>
      <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
        <p style="font-size:15px;">Hi <strong>${escapeHtml(data.name)}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.6;">
          Thank you for requesting a discovery call for <strong>${escapeHtml(data.service)}</strong>.
          Unfortunately, we are unable to confirm your requested slot at this time.
        </p>
        ${formatMessageBlock(data.message)}
        <p style="font-size:14px;color:#374151;line-height:1.6;">
          You are welcome to choose another time on our website or contact us on
          <a href="${buildWhatsAppUrl()}" style="color:#5b5fef;">WhatsApp</a>.
        </p>
        <p style="font-size:14px;color:#374151;margin-top:24px;">— The Pixiio Team</p>
      </div>
    </div>
  `;
}

export function bookingCustomClientEmail(data: {
  name: string;
  service: string;
  dateLabel: string;
  slot: string;
  timezone: string;
  meetLink?: string;
  message: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <div style="background:#5b5fef;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Message About Your Booking</h1>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">Pixiio Design Agency</p>
      </div>
      <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
        <p style="font-size:15px;">Hi <strong>${escapeHtml(data.name)}</strong>,</p>
        ${formatMessageBlock(data.message)}
        ${bookingDetailsBlock(data)}
        <p style="font-size:14px;color:#374151;line-height:1.6;">
          Reply to this email or message us on
          <a href="${buildWhatsAppUrl()}" style="color:#5b5fef;">WhatsApp</a> if you have any questions.
        </p>
        <p style="font-size:14px;color:#374151;margin-top:24px;">— The Pixiio Team</p>
      </div>
    </div>
  `;
}
