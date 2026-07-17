"use server";

import { cookies, headers } from "next/headers";
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

  // ── 1. Rate Limiting ─────────────────────────────────────────────────────────
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
  } catch { /* Redis error — skip, login tetap jalan */ }

  // ── 2. Cari user ──────────────────────────────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, name: true, email: true, role: true, passwordHash: true },
  }).catch(() => null);

  if (!user) {
    void writeLog({ email, ip, userAgent, success: false, reason: "user_not_found" });
    return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
  }

  // ── 3. Verifikasi password ────────────────────────────────────────────────────
  const isValid = await bcrypt.compare(password, user.passwordHash).catch(() => false);
  if (!isValid) {
    void writeLog({ email, ip, userAgent, success: false, reason: "wrong_password", userId: user.id });
    return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
  }

  // ── 4. Buat JWT ───────────────────────────────────────────────────────────────
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return { error: "Konfigurasi server bermasalah (AUTH_SECRET). Hubungi admin." };
  }

  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  try {
    // Lazy import encode — menghindari bundling issue di Vercel
    const { encode } = await import("next-auth/jwt");
    const token = await encode({
      token: {
        sub: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret,
      salt: cookieName,
      maxAge: 30 * 24 * 60 * 60,
    });

    // ── 5. Set cookie ─────────────────────────────────────────────────────────
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    void writeLog({ email: user.email, ip, userAgent, success: true, userId: user.id, role: user.role });
    return {};

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[loginAction] JWT/Cookie error:", msg);
    return { error: `Login gagal: ${msg}` };
  }
}

async function writeLog(data: {
  email: string; ip: string; userAgent: string; success: boolean;
  reason?: string; userId?: string; role?: string;
}) {
  try {
    const { getMongoDb } = await import("@/lib/mongodb");
    const db = await getMongoDb();
    if (db) await db.collection("login_logs").insertOne({ ...data, timestamp: new Date() });
  } catch { /* tidak kritis */ }
}
