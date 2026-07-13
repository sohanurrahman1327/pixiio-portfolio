import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { isKvEnabled, kvGetJson, kvSetJson } from "@/lib/kv";

const TOTP_KEY = "pixiio:admin-totp";
const DATA_DIR = path.join(process.cwd(), "data");
const TOTP_FILE = path.join(DATA_DIR, "admin-totp.json");

export async function getStoredTotpSecret(): Promise<string | null> {
  const fromEnv = process.env.BOOKING_ADMIN_TOTP_SECRET?.replace(/\s+/g, "").trim();
  if (fromEnv) return fromEnv.toUpperCase();

  if (isKvEnabled()) {
    const data = await kvGetJson<{ secret?: string }>(TOTP_KEY);
    const secret = data?.secret?.replace(/\s+/g, "").trim();
    return secret ? secret.toUpperCase() : null;
  }

  if (process.env.VERCEL) return null;

  try {
    const raw = await readFile(TOTP_FILE, "utf8");
    const parsed = JSON.parse(raw) as { secret?: string };
    const secret = parsed.secret?.replace(/\s+/g, "").trim();
    return secret ? secret.toUpperCase() : null;
  } catch {
    return null;
  }
}

export async function saveTotpSecret(secret: string) {
  const cleaned = secret.replace(/\s+/g, "").trim().toUpperCase();
  if (!cleaned) throw new Error("Empty TOTP secret");

  const payload = { secret: cleaned, updatedAt: new Date().toISOString() };

  if (isKvEnabled()) {
    await kvSetJson(TOTP_KEY, payload);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Cannot persist 2FA secret online without Redis. Set BOOKING_ADMIN_TOTP_SECRET in Vercel env, or ensure Upstash KV is connected."
    );
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TOTP_FILE, JSON.stringify(payload, null, 2), "utf8");
}

export async function isTotpConfigured() {
  return !!(await getStoredTotpSecret());
}
