import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateTotpSecret(bytes = 20): string {
  const buf = randomBytes(bytes);
  return encodeBase32(buf);
}

export function encodeBase32(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

export function decodeBase32(secret: string): Buffer {
  const cleaned = secret.replace(/[\s=-]/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of cleaned) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) throw new Error("Invalid base32 secret");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function hotp(secret: Buffer, counter: number): string {
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", secret).update(counterBuf).digest();
  const offset = digest[digest.length - 1] & 0xf;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);
  return String(code % 1_000_000).padStart(6, "0");
}

export function generateTotp(secretBase32: string, timeStep = 30, at = Date.now()): string {
  const secret = decodeBase32(secretBase32);
  const counter = Math.floor(at / 1000 / timeStep);
  return hotp(secret, counter);
}

export function verifyTotp(
  secretBase32: string,
  token: string,
  window = 1,
  timeStep = 30,
  at = Date.now()
): boolean {
  const cleaned = token.replace(/\s+/g, "").trim();
  if (!/^\d{6}$/.test(cleaned)) return false;

  const secret = decodeBase32(secretBase32);
  const counter = Math.floor(at / 1000 / timeStep);
  const expected = Buffer.from(cleaned);

  for (let i = -window; i <= window; i++) {
    const candidate = Buffer.from(hotp(secret, counter + i));
    if (candidate.length === expected.length && timingSafeEqual(candidate, expected)) {
      return true;
    }
  }

  return false;
}

export function buildOtpAuthUrl(options: {
  secret: string;
  accountName?: string;
  issuer?: string;
}) {
  const issuer = options.issuer ?? "Pixiio Admin";
  const account = options.accountName ?? "agency.pixiio@gmail.com";
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = new URLSearchParams({
    secret: options.secret.replace(/\s+/g, "").toUpperCase(),
    issuer,
    algorithm: "SHA1",
    digits: "6",
    period: "30",
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

export function buildTotpQrImageUrl(otpauthUrl: string, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(otpauthUrl)}`;
}
