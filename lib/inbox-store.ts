import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { isKvEnabled, kvGetJson, kvSetJson } from "@/lib/kv";
import type { StoredContactInquiry, StoredSubscriber } from "@/lib/inbox-types";

export type { StoredContactInquiry, StoredSubscriber } from "@/lib/inbox-types";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");
const SUBSCRIBERS_KEY = "pixiio:subscribers";
const CONTACTS_KEY = "pixiio:contacts";

function canPersist() {
  return isKvEnabled() || !process.env.VERCEL;
}

async function readFileJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeFileJson(filePath: string, data: unknown) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function readList<T>(
  key: string,
  filePath: string,
  field: "subscribers" | "contacts"
): Promise<T[]> {
  if (isKvEnabled()) {
    const data = await kvGetJson<{ [k: string]: unknown }>(key);
    const list = data?.[field];
    return Array.isArray(list) ? (list as T[]) : [];
  }

  if (process.env.VERCEL) return [];

  const data = await readFileJson<{ [k: string]: unknown }>(filePath, { [field]: [] });
  const list = data?.[field];
  return Array.isArray(list) ? (list as T[]) : [];
}

async function writeList(
  key: string,
  filePath: string,
  field: "subscribers" | "contacts",
  items: unknown[]
) {
  if (!canPersist()) {
    console.warn(`[inbox-store] Skipping persist for ${field} (no durable store).`);
    return;
  }

  const payload = { [field]: items };

  if (isKvEnabled()) {
    await kvSetJson(key, payload);
    return;
  }

  await writeFileJson(filePath, payload);
}

function isSubscriber(item: unknown): item is StoredSubscriber {
  if (!item || typeof item !== "object") return false;
  const s = item as Partial<StoredSubscriber>;
  return typeof s.id === "string" && typeof s.email === "string";
}

function isContact(item: unknown): item is StoredContactInquiry {
  if (!item || typeof item !== "object") return false;
  const c = item as Partial<StoredContactInquiry>;
  return typeof c.id === "string" && typeof c.email === "string" && typeof c.name === "string";
}

export async function listSubscribers() {
  const items = (await readList<unknown>(SUBSCRIBERS_KEY, SUBSCRIBERS_FILE, "subscribers")).filter(
    isSubscriber
  );
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function listContactInquiries() {
  const items = (await readList<unknown>(CONTACTS_KEY, CONTACTS_FILE, "contacts")).filter(isContact);
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function upsertSubscriber(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const now = new Date().toISOString();
  const items = await listSubscribers();
  const existing = items.find((s) => s.email.toLowerCase() === normalized);

  if (existing) {
    existing.updatedAt = now;
    await writeList(SUBSCRIBERS_KEY, SUBSCRIBERS_FILE, "subscribers", items);
    return existing;
  }

  const subscriber: StoredSubscriber = {
    id: randomUUID(),
    email: normalized,
    source: "newsletter",
    createdAt: now,
    updatedAt: now,
  };

  items.unshift(subscriber);
  await writeList(SUBSCRIBERS_KEY, SUBSCRIBERS_FILE, "subscribers", items);
  return subscriber;
}

export async function createContactInquiry(input: {
  name: string;
  email: string;
  project?: string;
  budget?: string;
  package?: string;
  message: string;
  hasReferenceImage?: boolean;
  referenceImagePreview?: string;
  fromPricing?: boolean;
}) {
  const inquiry: StoredContactInquiry = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    project: (input.project ?? "Not specified").trim(),
    budget: (input.budget ?? "Not specified").trim(),
    package: (input.package ?? "General Inquiry").trim(),
    message: input.message.trim(),
    hasReferenceImage: Boolean(input.hasReferenceImage),
    referenceImagePreview: input.referenceImagePreview,
    fromPricing: Boolean(input.fromPricing),
    createdAt: new Date().toISOString(),
  };

  const items = await listContactInquiries();
  items.unshift(inquiry);
  await writeList(CONTACTS_KEY, CONTACTS_FILE, "contacts", items);
  return inquiry;
}
