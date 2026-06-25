import { createHmac, timingSafeEqual } from "crypto";

export interface BookingTokenPayload {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  notes: string;
  guests: string;
  dateLabel: string;
  slot: string;
  timezone: string;
  meetLink: string;
  exp: number;
}

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  return (
    process.env.BOOKING_ADMIN_SECRET?.trim() ||
    process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").trim() ||
    "pixiio-booking-dev-secret"
  );
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(data: string) {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function createBookingToken(
  data: Omit<BookingTokenPayload, "exp">,
  ttlMs = TOKEN_TTL_MS
): string {
  const payload: BookingTokenPayload = {
    ...data,
    exp: Date.now() + ttlMs,
  };
  const encoded = toBase64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyBookingToken(token: string): BookingTokenPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  try {
    const sigBuf = Buffer.from(signature, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as BookingTokenPayload;
    if (!payload?.email || !payload?.name || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
