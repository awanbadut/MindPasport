"use server";

import { cookies, headers } from "next/headers";
import { encode } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function loginAction(
  email: string,
  password: string
): Promise<{ error?: string; rateLimited?: boolean; retryAfter?: number }> {
  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  let ip = "anonymous";
  let userAgent = "unknown";

  try {
    const headerStore = await headers();
    ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? headerStore.get("x-real-ip")
      ?? "anonymous";
    userAgent = headerStore.get("user-agent") ?? "unknown";
  } catch { /* tidak kritis */ }

  // ── 1. Rate Limiting (lazy import agar tidak crash saat module load) ─────────
  try {
    const { loginRatelimit } = await import("@/lib/ratelimit");
    if (loginRatelimit) {
      const { success, reset } = await loginRatelimit.limit(ip);
      if (!success) {
        const retryMinutes = Math.ceil((reset - Date.now()) / 60000);
        void writeLog({ email, ip, userAgent, success: false, reason: "rate_limited" });
        return {
          error: `Terlalu banyak percobaan. Coba lagi dalam ${retryMinutes} menit.`,
          rateLimited: true,
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        };
      }
    }
  } catch (e) {
    console.warn("[loginAction] Rate limit skip (Redis unavailable):", e);
  }

  // ── 2. Verifikasi kredensial ───────────────────────────────────────────────
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });

    if (!user) {
      void writeLog({ email, ip, userAgent, success: false, reason: "user_not_found" });
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      void writeLog({ email, ip, userAgent, success: false, reason: "wrong_password", userId: user.id });
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // ── 3. Buat JWT ───────────────────────────────────────────────────────────
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return { error: "Konfigurasi server bermasalah (AUTH_SECRET missing). Hubungi admin." };
    }

    const isProduction = process.env.NODE_ENV === "production";
    const cookieName = isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    const nowSeconds = Math.floor(Date.now() / 1000);
    const token = await encode({
      token: {
        sub: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        iat: nowSeconds,
        exp: nowSeconds + 30 * 24 * 60 * 60,
      },
      secret,
      salt: cookieName,
      maxAge: 30 * 24 * 60 * 60,
    });

    // ── 4. Set cookie sesi ────────────────────────────────────────────────────
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    // ── 5. Log sukses ke MongoDB (fire-and-forget) ────────────────────────────
    void writeLog({ email: user.email, ip, userAgent, success: true, userId: user.id, role: user.role });

    return {};

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[loginAction] ERROR:", msg);
    return { error: `Login gagal: ${msg}` };
  }
}

// Fire-and-forget: tulis log ke MongoDB via lazy import
async function writeLog(data: {
  email: string; ip: string; userAgent: string; success: boolean;
  reason?: string; userId?: string; role?: string;
}) {
  try {
    const { getMongoDb } = await import("@/lib/mongodb");
    const db = await getMongoDb();
    if (db) {
      await db.collection("login_logs").insertOne({ ...data, timestamp: new Date() });
    }
  } catch (e) {
    console.warn("[MongoDB] Log gagal:", e);
  }
}
