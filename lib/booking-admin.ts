import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "booking-admin-session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function getBookingAdminSecret() {
  return (
    process.env.BOOKING_ADMIN_SECRET?.trim() ||
    process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").trim() ||
    "pixiio-booking-dev-secret"
  );
}

export function getAdminSecretHint() {
  if (process.env.BOOKING_ADMIN_SECRET?.trim()) {
    return "Use the value of BOOKING_ADMIN_SECRET from your .env.local file.";
  }
  if (process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").trim()) {
    return "BOOKING_ADMIN_SECRET is not set. Use your GMAIL_APP_PASSWORD from .env.local (spaces optional).";
  }
  return "Set BOOKING_ADMIN_SECRET in .env.local, or use the default dev secret: pixiio-booking-dev-secret";
}

export function verifyAdminKey(key: string | null | undefined) {
  if (!key) return false;
  return key.trim() === getBookingAdminSecret();
}

function signSession(exp: number) {
  return createHmac("sha256", getBookingAdminSecret()).update(String(exp)).digest("base64url");
}

export function createAdminSessionToken() {
  const exp = Date.now() + SESSION_TTL_MS;
  return `${exp}.${signSession(exp)}`;
}

export function verifyAdminSessionToken(token: string | null | undefined) {
  if (!token) return false;
  const [expRaw, signature] = token.split(".");
  if (!expRaw || !signature) return false;

  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const expected = signSession(exp);
  try {
    const sigBuf = Buffer.from(signature, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    return sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export function getAdminKeyFromRequest(req: NextRequest) {
  const header = req.headers.get("x-booking-admin-key");
  if (header) return header;
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function isAdminRequest(req: NextRequest) {
  if (verifyAdminKey(getAdminKeyFromRequest(req))) return true;
  return verifyAdminSessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export function setAdminSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
