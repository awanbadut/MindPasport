"use server";

import { cookies, headers } from "next/headers";
import { encode } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { loginRatelimit } from "@/lib/ratelimit";
import { getMongoDb } from "@/lib/mongodb";

// Login Server Action — bypass NextAuth CSRF sepenuhnya.
// Verifikasi kredensial manual + JWT encode langsung + rate limiting via Upstash Redis
// + audit log ke MongoDB.

export async function loginAction(
  email: string,
  password: string
): Promise<{ error?: string; rateLimited?: boolean; retryAfter?: number }> {
  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  // Ambil IP untuk rate limiting & audit log
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "anonymous";
  const userAgent = headerStore.get("user-agent") ?? "unknown";

  // ── 1. Rate Limiting (jika Redis tersedia) ──────────────────────────────────
  if (loginRatelimit) {
    const { success, limit, remaining, reset } = await loginRatelimit.limit(ip);

    if (!success) {
      const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
      const retryMinutes = Math.ceil(retryAfterSeconds / 60);

      // Log ke MongoDB
      await writeLoginLog({ email, ip, userAgent, success: false, reason: "rate_limited" });

      return {
        error: `Terlalu banyak percobaan login. Coba lagi dalam ${retryMinutes} menit.`,
        rateLimited: true,
        retryAfter: retryAfterSeconds,
      };
    }

    console.log(`[loginAction] IP: ${ip} | Remaining: ${remaining}/${limit}`);
  }

  try {
    // ── 2. Cari user di database ───────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });

    if (!user) {
      await writeLoginLog({ email, ip, userAgent, success: false, reason: "user_not_found" });
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // ── 3. Verifikasi password ─────────────────────────────────────────────────
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      await writeLoginLog({ email, ip, userAgent, success: false, reason: "wrong_password", userId: user.id });
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // ── 4. Buat JWT token dengan format NextAuth v5 / Auth.js ─────────────────
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("[loginAction] AUTH_SECRET tidak ditemukan di environment!");
      return { error: "Konfigurasi server bermasalah. Hubungi administrator." };
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

    // ── 5. Set cookie sesi ────────────────────────────────────────────────────
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    // ── 6. Catat login sukses ke MongoDB ──────────────────────────────────────
    await writeLoginLog({ email: user.email, ip, userAgent, success: true, userId: user.id, role: user.role });

    return {};
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[loginAction] EXCEPTION:", errMsg);
    return { error: `Terjadi kesalahan: ${errMsg}` };
  }
}

// ── Helper: Tulis log ke MongoDB (fire-and-forget, tidak block login) ─────────
async function writeLoginLog(data: {
  email: string;
  ip: string;
  userAgent: string;
  success: boolean;
  reason?: string;
  userId?: string;
  role?: string;
}) {
  try {
    const db = await getMongoDb();
    if (!db) return; // MongoDB tidak dikonfigurasi, skip

    await db.collection("login_logs").insertOne({
      ...data,
      timestamp: new Date(),
    });
  } catch (mongoErr) {
    // Jangan sampai MongoDB error membuat login gagal
    console.warn("[MongoDB] Gagal tulis log:", mongoErr);
  }
}
