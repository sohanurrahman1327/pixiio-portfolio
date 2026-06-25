import { Redis } from "@upstash/redis";

const BOOKINGS_KEY = "pixiio:bookings";

function getRedisConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();

  if (!url || !token) return null;
  return { url, token };
}

export function isOnlineBookingStoreEnabled() {
  return getRedisConfig() !== null;
}

let redisClient: Redis | null = null;

function getRedisClient() {
  const config = getRedisConfig();
  if (!config) return null;

  if (!redisClient) {
    redisClient = new Redis({ url: config.url, token: config.token });
  }

  return redisClient;
}

export async function readBookingsFromRedis(): Promise<unknown[]> {
  const redis = getRedisClient();
  if (!redis) return [];

  const data = await redis.get<{ bookings?: unknown[] }>(BOOKINGS_KEY);
  return Array.isArray(data?.bookings) ? data.bookings : [];
}

export async function writeBookingsToRedis(bookings: unknown[]) {
  const redis = getRedisClient();
  if (!redis) {
    throw new Error("Online booking store is not configured.");
  }

  await redis.set(BOOKINGS_KEY, { bookings });
}
