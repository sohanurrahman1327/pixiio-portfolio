import { NextRequest, NextResponse } from "next/server";
import { getBookedSlotKeys } from "@/lib/booking-store";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Valid date query is required." }, { status: 400 });
  }

  const slots = await getBookedSlotKeys(date);
  return NextResponse.json({ date, slots });
}
