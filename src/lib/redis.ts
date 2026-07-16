import { Redis } from "@upstash/redis";

// Singleton Redis client untuk Upstash (HTTP-based, cocok untuk Vercel serverless)
// Jika env var tidak ada (development tanpa Redis), kembalikan null agar bisa dimatikan gracefully.

let redis: Redis | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export default redis;
