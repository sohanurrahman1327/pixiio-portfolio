import { isKvEnabled, kvGetJson, kvSetJson } from "@/lib/kv";

const BOOKINGS_KEY = "pixiio:bookings";

export function isOnlineBookingStoreEnabled() {
  return isKvEnabled();
}

export async function readBookingsFromRedis(): Promise<unknown[]> {
  const data = await kvGetJson<{ bookings?: unknown[] }>(BOOKINGS_KEY);
  return Array.isArray(data?.bookings) ? data.bookings : [];
}

export async function writeBookingsToRedis(bookings: unknown[]) {
  await kvSetJson(BOOKINGS_KEY, { bookings });
}
