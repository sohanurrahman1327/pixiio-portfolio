import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/site-config";

const PLACEHOLDER_PASSWORD = "your_16_char_app_password_here";

export function isEmailConfigured(): boolean {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").trim();
  return !!(user && pass && pass !== PLACEHOLDER_PASSWORD);
}

export function getEmailConfigError(): string {
  return `Email service is not configured yet. Please contact us directly at ${CONTACT_EMAIL}`;
}

function getGmailAuth() {
  const user = process.env.GMAIL_USER?.trim();
  // App passwords are 16 chars; strip spaces if pasted as "abcd efgh ijkl mnop"
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").trim();
  return { user, pass };
}

export function createMailTransporter() {
  const { user, pass } = getGmailAuth();

  // Port 465 (implicit SSL) is far more reliable than 587/STARTTLS on
  // serverless hosts like Vercel, where STARTTLS handshakes often hang.
  // Override with SMTP_PORT=587 if your host requires it.
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
    // Fail fast instead of letting the serverless function time out silently.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

export async function sendAgencyEmail(options: {
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const transporter = createMailTransporter();
  await transporter.sendMail({
    from: `"Pixiio Design Agency" <${process.env.GMAIL_USER}>`,
    to: CONTACT_EMAIL,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
  });
}

export async function sendClientConfirmation(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = createMailTransporter();
  await transporter.sendMail({
    from: `"Pixiio Design Agency" <${process.env.GMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

export async function sendClientDirectEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  }[];
}) {
  const transporter = createMailTransporter();
  await transporter.sendMail({
    from: `"Pixiio Design Agency" <${process.env.GMAIL_USER}>`,
    to: options.to,
    replyTo: process.env.GMAIL_USER,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments,
  });
}

/** Shared HTML wrapper for agency notification emails */
export function agencyEmailHtml(title: string, rows: { label: string; value: string }[]) {
  const rowsHtml = rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 0;color:#6b7280;width:140px;">${r.label}</td><td style="padding:8px 0;font-weight:600;">${r.value}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <div style="background:#5b5fef;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">${title}</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">Pixiio Design Agency</p>
      </div>
      <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">${rowsHtml}</table>
      </div>
    </div>
  `;
}
