import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import {
  isOnlineBookingStoreEnabled,
  readBookingsFromRedis,
  writeBookingsToRedis,
} from "@/lib/booking-redis";
import type { BookingStatus, StoredBooking } from "@/lib/booking-types";

export type { BookingStatus, StoredBooking } from "@/lib/booking-types";

interface BookingsFile {
  bookings: StoredBooking[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

const ACTIVE_STATUSES: BookingStatus[] = ["pending", "accepted", "completed"];

function normalizeBookings(raw: unknown[]): StoredBooking[] {
  return raw.filter((item): item is StoredBooking => {
    if (!item || typeof item !== "object") return false;
    const b = item as Partial<StoredBooking>;
    return typeof b.id === "string" && typeof b.email === "string";
  });
}

async function readAllFromFile(): Promise<BookingsFile> {
  try {
    const raw = await readFile(BOOKINGS_FILE, "utf8");
    const parsed = JSON.parse(raw) as BookingsFile;
    return { bookings: normalizeBookings(Array.isArray(parsed.bookings) ? parsed.bookings : []) };
  } catch {
    return { bookings: [] };
  }
}

async function writeAllToFile(data: BookingsFile) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(BOOKINGS_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function readAll(): Promise<BookingsFile> {
  if (isOnlineBookingStoreEnabled()) {
    const bookings = normalizeBookings(await readBookingsFromRedis());
    return { bookings };
  }

  return readAllFromFile();
}

async function writeAll(data: BookingsFile) {
  if (isOnlineBookingStoreEnabled()) {
    await writeBookingsToRedis(data.bookings);
    return;
  }

  await writeAllToFile(data);
}

export function getBookingStoreMode(): "redis" | "file" {
  return isOnlineBookingStoreEnabled() ? "redis" : "file";
}

export function dateKeyFromIso(iso: string, timezone = "Asia/Dhaka") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function dateKeyFromDate(date: Date, timezone = "Asia/Dhaka") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function listBookings() {
  const data = await readAll();
  return data.bookings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBookedSlotKeys(dateKey: string) {
  const data = await readAll();
  return data.bookings
    .filter((b) => b.dateKey === dateKey && ACTIVE_STATUSES.includes(b.status))
    .map((b) => b.slotKey);
}

export async function isSlotTaken(dateKey: string, slotKey: string, excludeId?: string) {
  const data = await readAll();
  return data.bookings.some(
    (b) =>
      b.id !== excludeId &&
      b.dateKey === dateKey &&
      b.slotKey === slotKey &&
      ACTIVE_STATUSES.includes(b.status)
  );
}

export async function getBookingById(id: string) {
  const data = await readAll();
  return data.bookings.find((b) => b.id === id) ?? null;
}

export async function getBookingByToken(token: string) {
  const data = await readAll();
  return data.bookings.find((b) => b.respondToken === token) ?? null;
}

export async function createBooking(input: {
  name: string;
  email: string;
  phone: string;
  service: string;
  notes: string;
  guests: string;
  dateKey: string;
  dateLabel: string;
  slotKey: string;
  slotLabel: string;
  timezone: string;
  meetLink: string;
  respondToken: string;
}) {
  const taken = await isSlotTaken(input.dateKey, input.slotKey);
  if (taken) {
    throw new Error("SLOT_TAKEN");
  }

  const now = new Date().toISOString();
  const booking: StoredBooking = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    service: input.service.trim(),
    notes: input.notes.trim(),
    guests: input.guests,
    dateKey: input.dateKey,
    dateLabel: input.dateLabel,
    slotKey: input.slotKey,
    slotLabel: input.slotLabel,
    timezone: input.timezone,
    meetLink: input.meetLink,
    summary: `${input.service} · ${input.dateLabel} · ${input.slotLabel}`,
    status: "pending",
    adminMessage: "",
    respondToken: input.respondToken,
    createdAt: now,
    updatedAt: now,
  };

  const data = await readAll();
  data.bookings.push(booking);
  await writeAll(data);
  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  adminMessage = ""
) {
  const data = await readAll();
  const booking = data.bookings.find((b) => b.id === id);
  if (!booking) return null;

  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  if (adminMessage.trim()) booking.adminMessage = adminMessage.trim();

  await writeAll(data);
  return booking;
}

export async function updateBookingRespondToken(id: string, respondToken: string) {
  const data = await readAll();
  const booking = data.bookings.find((b) => b.id === id);
  if (!booking) return null;

  booking.respondToken = respondToken;
  booking.updatedAt = new Date().toISOString();
  await writeAll(data);
  return booking;
}
