import { NextRequest, NextResponse } from "next/server";
import { getStoredTotpSecret, isTotpConfigured, saveTotpSecret } from "@/lib/admin-totp-store";
import {
  clearAdminSessionCookie,
  createPending2faToken,
  getAdminSecretHint,
  getPending2faFromRequest,
  isAdminRequest,
  setAdminSessionCookie,
  setPending2faCookie,
  verifyAdminKey,
} from "@/lib/booking-admin";
import {
  buildOtpAuthUrl,
  buildTotpQrImageUrl,
  generateTotpSecret,
  verifyTotp,
} from "@/lib/totp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const key = typeof body?.key === "string" ? body.key : "";
    const totp = typeof body?.totp === "string" ? body.totp : "";
    const action = typeof body?.action === "string" ? body.action : "login";

    /* ── Step 2: verify / confirm Google Authenticator code ── */
    if (action === "verify-2fa" || totp) {
      const pending = getPending2faFromRequest(req);
      if (!pending) {
        return NextResponse.json(
          { error: "Password step expired. Enter your admin secret again." },
          { status: 401 }
        );
      }

      if (!totp.trim()) {
        return NextResponse.json({ error: "Enter the 6-digit authenticator code." }, { status: 400 });
      }

      if (pending.mode === "setup") {
        const setupSecret = pending.setupSecret;
        if (!setupSecret || !verifyTotp(setupSecret, totp)) {
          return NextResponse.json({ error: "Invalid authenticator code. Try again." }, { status: 401 });
        }

        try {
          await saveTotpSecret(setupSecret);
        } catch (err) {
          return NextResponse.json(
            {
              error:
                err instanceof Error
                  ? err.message
                  : "Could not save 2FA secret. Set BOOKING_ADMIN_TOTP_SECRET in env.",
            },
            { status: 500 }
          );
        }

        const res = NextResponse.json({ success: true, setupComplete: true });
        setAdminSessionCookie(res);
        return res;
      }

      const secret = await getStoredTotpSecret();
      if (!secret || !verifyTotp(secret, totp)) {
        return NextResponse.json({ error: "Invalid authenticator code. Try again." }, { status: 401 });
      }

      const res = NextResponse.json({ success: true });
      setAdminSessionCookie(res);
      return res;
    }

    /* ── Step 1: verify admin password ── */
    if (!verifyAdminKey(key)) {
      return NextResponse.json(
        {
          error: "Invalid admin secret.",
          hint: getAdminSecretHint(),
        },
        { status: 401 }
      );
    }

    const configured = await isTotpConfigured();

    if (configured) {
      const pendingToken = createPending2faToken({ mode: "verify" });
      const res = NextResponse.json({
        success: true,
        requires2fa: true,
        message: "Enter the 6-digit code from Google Authenticator.",
      });
      setPending2faCookie(res, pendingToken);
      return res;
    }

    // First-time Google Authenticator enrollment
    const setupSecret = generateTotpSecret();
    const otpauthUrl = buildOtpAuthUrl({ secret: setupSecret });
    const pendingToken = createPending2faToken({ mode: "setup", setupSecret });
    const res = NextResponse.json({
      success: true,
      requires2faSetup: true,
      secret: setupSecret,
      otpauthUrl,
      qrUrl: buildTotpQrImageUrl(otpauthUrl),
      message: "Scan this QR with Google Authenticator, then enter the 6-digit code.",
    });
    setPending2faCookie(res, pendingToken);
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  clearAdminSessionCookie(res);
  return res;
}
