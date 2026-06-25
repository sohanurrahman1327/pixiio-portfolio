import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/booking-admin";
import { bookingDirectMessageEmail } from "@/lib/booking-email";
import { getBookingById, updateBookingStatus } from "@/lib/booking-store";
import { getEmailConfigError, isEmailConfigured, sendClientDirectEmail } from "@/lib/email";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 12 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
]);

function isAllowedFile(file: File) {
  if (!file.size) return false;
  if (file.type && ALLOWED_MIME.has(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg", "pdf", "txt", "doc", "docx", "xls", "xlsx", "zip"].includes(ext ?? "");
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ error: getEmailConfigError() }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const bookingId = String(formData.get("bookingId") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const link = String(formData.get("link") ?? "").trim();
    const subjectRaw = String(formData.get("subject") ?? "").trim();
    const files = formData.getAll("attachments").filter((item): item is File => item instanceof File && item.size > 0);

    if (!bookingId || !message) {
      return NextResponse.json({ error: "Booking ID and message are required." }, { status: 400 });
    }

    if (link && !/^https?:\/\/.+/i.test(link)) {
      return NextResponse.json({ error: "Link must start with http:// or https://" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `You can attach up to ${MAX_FILES} files.` }, { status: 400 });
    }

    let totalBytes = 0;
    for (const file of files) {
      if (!isAllowedFile(file)) {
        return NextResponse.json({ error: `File type not allowed: ${file.name}` }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: `${file.name} is too large (max 5 MB each).` }, { status: 400 });
      }
      totalBytes += file.size;
    }
    if (totalBytes > MAX_TOTAL_BYTES) {
      return NextResponse.json({ error: "Total attachment size exceeds 12 MB." }, { status: 400 });
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || undefined,
      }))
    );

    const subject =
      subjectRaw ||
      `Message from Pixiio — ${booking.service} · ${booking.dateLabel}`;

    const plainText = [
      `Hi ${booking.name},`,
      "",
      message,
      link ? `\nLink: ${link}` : "",
      "",
      "Booking reference:",
      `Service: ${booking.service}`,
      `Date: ${booking.dateLabel}`,
      `Time: ${booking.slotLabel}`,
      "",
      "— The Pixiio Team",
    ]
      .filter(Boolean)
      .join("\n");

    await sendClientDirectEmail({
      to: booking.email,
      subject,
      html: bookingDirectMessageEmail({
        name: booking.name,
        message,
        link,
        service: booking.service,
        dateLabel: booking.dateLabel,
        slot: booking.slotLabel,
      }),
      text: plainText,
      attachments,
    });

    await updateBookingStatus(booking.id, booking.status, message);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[booking/admin/message] error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
