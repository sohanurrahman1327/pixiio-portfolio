import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/booking-admin";
import type { BookingStatus } from "@/lib/booking-types";
import { listBookings, updateBookingStatus } from "@/lib/booking-store";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const bookings = await listBookings();
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    accepted: bookings.filter((b) => b.status === "accepted").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    declined: bookings.filter((b) => b.status === "declined").length,
  };

  return NextResponse.json({ bookings, stats });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, message } = body as {
      id?: string;
      status?: BookingStatus;
      message?: string;
    };

    if (!id || !status || !["accepted", "declined", "completed", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid update request." }, { status: 400 });
    }

    const updated = await updateBookingStatus(id, status, message);
    if (!updated) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ booking: updated });
  } catch (err) {
    console.error("[booking/admin] error:", err);
    return NextResponse.json({ error: "Failed to update booking." }, { status: 500 });
  }
}
