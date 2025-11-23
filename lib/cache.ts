import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (url && token) redis = new Redis({ url, token });

export async function cacheGet(key: string) {
  if (redis) return redis.get(key);
  return null;
}

export async function cacheSet(key: string, value: any, ttl = 60) {
  if (redis) return redis.set(key, value, { ex: ttl });
  return null;
}
