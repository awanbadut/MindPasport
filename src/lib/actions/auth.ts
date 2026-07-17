"use server";

import { cookies, headers } from "next/headers";
import { encode } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { loginRatelimit } from "@/lib/ratelimit";
import { getMongoDb } from "@/lib/mongodb";

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
  } catch {
    // headers() gagal — tidak kritis, lanjutkan
  }

  // ── 1. Rate Limiting (wrapped agar tidak crash login jika Redis bermasalah) ──
  try {
    if (loginRatelimit) {
      const { success, limit, remaining, reset } = await loginRatelimit.limit(ip);
      if (!success) {
        const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
        const retryMinutes = Math.ceil(retryAfterSeconds / 60);
        await writeLoginLog({ email, ip, userAgent, success: false, reason: "rate_limited" });
        return {
          error: `Terlalu banyak percobaan login. Coba lagi dalam ${retryMinutes} menit.`,
          rateLimited: true,
          retryAfter: retryAfterSeconds,
        };
      }
      console.log(`[loginAction] IP: ${ip} | Remaining: ${remaining}/${limit}`);
    }
  } catch (rateErr) {
    // Jika Redis error, lewati rate limiting — jangan blokir login
    console.warn("[loginAction] Rate limit check failed (Redis?):", rateErr);
  }

  // ── 2. Verifikasi kredensial ───────────────────────────────────────────────
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });

    if (!user) {
      await writeLoginLog({ email, ip, userAgent, success: false, reason: "user_not_found" });
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      await writeLoginLog({ email, ip, userAgent, success: false, reason: "wrong_password", userId: user.id });
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // ── 3. Buat JWT ───────────────────────────────────────────────────────────
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("[loginAction] AUTH_SECRET tidak ditemukan!");
      return { error: "Konfigurasi server bermasalah (AUTH_SECRET). Hubungi administrator." };
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

    // ── 5. Catat ke MongoDB (fire-and-forget) ─────────────────────────────────
    await writeLoginLog({ email: user.email, ip, userAgent, success: true, userId: user.id, role: user.role });

    return {};

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[loginAction] ERROR:", msg);
    return { error: `Login gagal: ${msg}` };
  }
}

async function writeLoginLog(data: {
  email: string; ip: string; userAgent: string; success: boolean;
  reason?: string; userId?: string; role?: string;
}) {
  try {
    const db = await getMongoDb();
    if (!db) return;
    await db.collection("login_logs").insertOne({ ...data, timestamp: new Date() });
  } catch (e) {
    console.warn("[MongoDB] Gagal tulis log:", e);
  }
}
