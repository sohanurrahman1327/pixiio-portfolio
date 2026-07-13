import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "booking-admin-session";
const PENDING_2FA_COOKIE = "booking-admin-2fa-pending";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PENDING_TTL_MS = 10 * 60 * 1000;

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

function sign(value: string) {
  return createHmac("sha256", getBookingAdminSecret()).update(value).digest("base64url");
}

function signSession(exp: number) {
  return sign(String(exp));
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

export type Pending2faPayload = {
  exp: number;
  mode: "verify" | "setup";
  setupSecret?: string;
};

export function createPending2faToken(payload: Omit<Pending2faPayload, "exp">) {
  const exp = Date.now() + PENDING_TTL_MS;
  const body: Pending2faPayload = { ...payload, exp };
  const encoded = Buffer.from(JSON.stringify(body), "utf8").toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyPending2faToken(token: string | null | undefined): Pending2faPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  try {
    const sigBuf = Buffer.from(signature, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Pending2faPayload;
    if (!payload?.exp || Date.now() > payload.exp) return null;
    if (payload.mode !== "verify" && payload.mode !== "setup") return null;
    return payload;
  } catch {
    return null;
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

export function getPending2faFromRequest(req: NextRequest) {
  return verifyPending2faToken(req.cookies.get(PENDING_2FA_COOKIE)?.value);
}

export function setAdminSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  res.cookies.set(PENDING_2FA_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function setPending2faCookie(res: NextResponse, token: string) {
  res.cookies.set(PENDING_2FA_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(PENDING_TTL_MS / 1000),
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
  res.cookies.set(PENDING_2FA_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
