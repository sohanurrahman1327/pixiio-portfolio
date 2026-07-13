import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/booking-admin";
import { listContactInquiries } from "@/lib/inbox-store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const contacts = await listContactInquiries();
  return NextResponse.json({
    contacts,
    stats: { total: contacts.length },
  });
}
