import { NextResponse } from "next/server";

// GET /api/debug-ratelimit?reset=true → reset counter
// GET /api/debug-ratelimit → tambah counter dan cek status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reset = searchParams.get("reset") === "true";

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  try {
    const { Redis } = await import("@upstash/redis");
    const { Ratelimit } = await import("@upstash/ratelimit");

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    if (reset) {
      // Hapus semua key rate limit untuk IP ini
      const keys = await redis.keys(`mindpassport:login:*`);
      for (const key of keys) await redis.del(key);
      return NextResponse.json({ message: "✅ Rate limit counter direset!", ip, deletedKeys: keys });
    }

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      prefix: "mindpassport:login",
    });

    const { success, limit, remaining, reset: resetAt } = await ratelimit.limit(ip);
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

    return NextResponse.json({
      ip,
      success,
      limit,
      remaining,
      blocked: !success,
      retryAfterSeconds: success ? null : retryAfter,
      message: success
        ? `✅ Masih bisa login. Sisa percobaan: ${remaining}/${limit}`
        : `🚫 DIBLOKIR! Coba lagi dalam ${Math.ceil(retryAfter / 60)} menit`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
