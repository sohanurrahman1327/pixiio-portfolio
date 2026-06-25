import { NextRequest, NextResponse } from "next/server";
import { agencyEmailHtml, getEmailConfigError, isEmailConfigured, sendAgencyEmail } from "@/lib/email";
import { CONTACT_EMAIL } from "@/lib/site-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, project, budget, message } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!isEmailConfigured()) {
      console.warn("[contact] Gmail credentials not configured in .env.local");
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
      return NextResponse.json({ success: true });
    }

    /* ── Contact form ── */
    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
    }

    await sendAgencyEmail({
      subject: `✉️ New Project Inquiry — ${name}`,
      html: agencyEmailHtml("New Project Inquiry", [
        { label: "Name", value: name },
        { label: "Email", value: `<a href="mailto:${email}" style="color:#5b5fef;">${email}</a>` },
        { label: "Project", value: project ?? "Not specified" },
        { label: "Budget", value: budget ?? "Not specified" },
        { label: "Message", value: message.replace(/\n/g, "<br>") },
      ]),
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact/route] error:", err);
    return NextResponse.json(
      { error: `Failed to send email. Please contact us directly at ${CONTACT_EMAIL}`, fallback: "mailto" },
      { status: 500 }
    );
  }
}
