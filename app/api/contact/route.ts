import { NextRequest, NextResponse } from "next/server";
import { agencyEmailHtml, getEmailConfigError, isEmailConfigured, sendAgencyEmail } from "@/lib/email";
import { createContactInquiry, upsertSubscriber } from "@/lib/inbox-store";
import { CONTACT_EMAIL } from "@/lib/site-config";

export const runtime = "nodejs";
export const maxDuration = 30;

// Vercel Functions hard-cap request bodies at 4.5 MB. The client compresses
// reference images before upload, so this is a safety ceiling, not the
// advertised 10 MB (that limit is enforced client-side, before compression).
const REFERENCE_IMAGE_MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Visit /api/contact to confirm the live deploy has Gmail configured. */
export async function GET() {
  return NextResponse.json({ emailConfigured: isEmailConfigured() });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let type: string | null = null;
    let name = "";
    let email = "";
    let project = "";
    let budget = "";
    let selectedPackage = "";
    let message = "";
    let fromPricing = false;
    let referenceImage: File | null = null;
    let referenceImagePreview = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      type = form.get("type")?.toString() ?? null;
      name = form.get("name")?.toString() ?? "";
      email = form.get("email")?.toString() ?? "";
      project = form.get("project")?.toString() ?? "";
      budget = form.get("budget")?.toString() ?? "";
      selectedPackage = form.get("package")?.toString() ?? "";
      message = form.get("message")?.toString() ?? "";
      fromPricing = form.get("fromPricing")?.toString() === "true";
      referenceImagePreview = form.get("referenceImagePreview")?.toString() ?? "";
      const file = form.get("referenceImage");
      if (file instanceof File && file.size > 0) referenceImage = file;
    } else {
      const body = await req.json();
      type = body.type ?? null;
      name = body.name ?? "";
      email = body.email ?? "";
      project = body.project ?? "";
      budget = body.budget ?? "";
      selectedPackage = body.package ?? "";
      message = body.message ?? "";
      fromPricing = Boolean(body.fromPricing);
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!isEmailConfigured()) {
      console.warn("[contact] GMAIL_USER / GMAIL_APP_PASSWORD missing on this deploy");
      return NextResponse.json({ error: getEmailConfigError(), fallback: "mailto" }, { status: 503 });
    }

    if (type === "newsletter") {
      await sendAgencyEmail({
        subject: "📬 Newsletter Subscription",
        html: agencyEmailHtml("Newsletter Subscription", [
          { label: "Email", value: `<a href="mailto:${email}" style="color:#5b5fef;">${email}</a>` },
        ]),
        replyTo: email,
      });

      try {
        await upsertSubscriber(email);
      } catch (err) {
        console.error("[contact] failed to persist subscriber:", err instanceof Error ? err.message : err);
      }

      return NextResponse.json({ success: true });
    }

    /* ── Contact form ── */
    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
    }

    let attachment: { filename: string; content: Buffer; contentType?: string } | undefined;
    if (referenceImage) {
      if (!ALLOWED_IMAGE_MIME.has(referenceImage.type)) {
        return NextResponse.json({ error: "Reference image must be a JPG, PNG, or WEBP file." }, { status: 400 });
      }
      if (referenceImage.size > REFERENCE_IMAGE_MAX_BYTES) {
        return NextResponse.json(
          { error: "Reference image is too large after compression. Please choose a smaller image." },
          { status: 400 }
        );
      }
      attachment = {
        filename: referenceImage.name || "reference-image.jpg",
        content: Buffer.from(await referenceImage.arrayBuffer()),
        contentType: referenceImage.type,
      };
    }

    await sendAgencyEmail({
      subject: `✉️ New Project Inquiry — ${name}`,
      html: agencyEmailHtml("New Project Inquiry", [
        { label: "Name", value: name },
        { label: "Email", value: `<a href="mailto:${email}" style="color:#5b5fef;">${email}</a>` },
        { label: "Project", value: project || "Not specified" },
        { label: "Budget", value: budget || "Not specified" },
        { label: "Package", value: selectedPackage || "General Inquiry" },
        { label: "Reference Image", value: attachment ? "Attached below" : "None" },
        { label: "Message", value: message.replace(/\n/g, "<br>") },
      ]),
      replyTo: email,
      attachments: attachment ? [attachment] : undefined,
    });

    try {
      const isSafePreview =
        referenceImagePreview.startsWith("data:image/") && referenceImagePreview.length < 400_000;

      await createContactInquiry({
        name,
        email,
        project,
        budget,
        package: selectedPackage,
        message,
        hasReferenceImage: Boolean(attachment),
        referenceImagePreview: isSafePreview ? referenceImagePreview : undefined,
        fromPricing,
      });
    } catch (err) {
      console.error("[contact] failed to persist inquiry:", err instanceof Error ? err.message : err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact/route] error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: `Failed to send email. Please contact us directly at ${CONTACT_EMAIL}`, fallback: "mailto" },
      { status: 500 }
    );
  }
}
