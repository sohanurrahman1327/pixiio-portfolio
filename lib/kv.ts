import { Redis } from "@upstash/redis";

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

export function isKvEnabled() {
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

export async function kvGetJson<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;
  return (await redis.get<T>(key)) ?? null;
}

export async function kvSetJson(key: string, value: unknown) {
  const redis = getRedisClient();
  if (!redis) {
    throw new Error("Online KV store is not configured.");
  }
  await redis.set(key, value);
}
