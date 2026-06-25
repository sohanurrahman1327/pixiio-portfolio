import type { BookingStatus, StoredBooking } from "@/lib/booking-types";
import type { BookingTokenPayload } from "@/lib/booking-token";

export function canRespondToBooking(status: BookingStatus) {
  return status === "pending" || status === "accepted";
}

export function storedBookingToPayload(stored: StoredBooking): BookingTokenPayload {
  return {
    bookingId: stored.id,
    name: stored.name,
    email: stored.email,
    phone: stored.phone,
    service: stored.service,
    notes: stored.notes,
    guests: stored.guests,
    dateLabel: stored.dateLabel,
    slot: stored.slotLabel,
    timezone: stored.timezone,
    meetLink: stored.meetLink,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
}

export function formatBookingSerial(index: number) {
  return String(index).padStart(2, "0");
}
