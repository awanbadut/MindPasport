import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Test Redis
  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    await redis.set("debug:test", "ok", { ex: 10 });
    const val = await redis.get("debug:test");
    results.redis = { status: "✅ OK", value: val, url: process.env.UPSTASH_REDIS_REST_URL?.substring(0, 30) + "..." };
  } catch (e) {
    results.redis = { status: "❌ ERROR", error: String(e) };
  }

  // Test MongoDB
  try {
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db("mindpassport");
    const count = await db.collection("login_logs").countDocuments();
    await client.close();
    results.mongodb = { status: "✅ OK", logCount: count };
  } catch (e) {
    results.mongodb = { status: "❌ ERROR", error: String(e) };
  }

  // Env vars check
  results.envVars = {
    AUTH_SECRET: process.env.AUTH_SECRET ? `✅ set (${process.env.AUTH_SECRET.length} chars)` : "❌ MISSING",
    UPSTASH_URL: process.env.UPSTASH_REDIS_REST_URL ? `✅ set` : "❌ MISSING",
    UPSTASH_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? `✅ set (${process.env.UPSTASH_REDIS_REST_TOKEN.length} chars)` : "❌ MISSING",
    MONGODB_URI: process.env.MONGODB_URI ? `✅ set` : "❌ MISSING",
  };

  return NextResponse.json(results, { status: 200 });
}
