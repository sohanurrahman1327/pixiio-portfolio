import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/booking-admin";
import { listSubscribers } from "@/lib/inbox-store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const subscribers = await listSubscribers();
  return NextResponse.json({
    subscribers,
    stats: { total: subscribers.length },
  });
}
