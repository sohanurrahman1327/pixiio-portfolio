export type BookingStatus = "pending" | "accepted" | "declined" | "completed";

export interface StoredBooking {
  id: string;
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
  summary: string;
  status: BookingStatus;
  adminMessage: string;
  respondToken: string;
  createdAt: string;
  updatedAt: string;
}
