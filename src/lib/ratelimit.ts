import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/lib/redis";

// Rate limiter untuk endpoint login:
// Maksimal 5 percobaan gagal per IP per 15 menit (sliding window)
// Jika Redis tidak dikonfigurasi, ratelimit di-skip (tidak error)

export const loginRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "mindpassport:login",
    })
  : null;
