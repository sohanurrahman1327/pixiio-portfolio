import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  getAdminSecretHint,
  isAdminRequest,
  setAdminSessionCookie,
  verifyAdminKey,
} from "@/lib/booking-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const key = typeof body?.key === "string" ? body.key : "";

    if (!verifyAdminKey(key)) {
      return NextResponse.json(
        {
          error: "Invalid admin secret.",
          hint: getAdminSecretHint(),
        },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });
    setAdminSessionCookie(res);
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
