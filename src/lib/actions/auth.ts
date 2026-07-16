"use server";

import { cookies, headers } from "next/headers";
import { encode } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { loginRatelimit } from "@/lib/ratelimit";

// Login Server Action — bypass NextAuth CSRF sepenuhnya.
// Verifikasi kredensial manual + JWT encode langsung + rate limiting via Upstash Redis.

export async function loginAction(
  email: string,
  password: string
): Promise<{ error?: string; rateLimited?: boolean; retryAfter?: number }> {
  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  // ── 1. Rate Limiting (jika Redis tersedia) ──────────────────────────────────
  if (loginRatelimit) {
    const headerStore = await headers();
    // Ambil IP dari header Vercel/proxy, fallback ke "anonymous"
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerStore.get("x-real-ip") ??
      "anonymous";

    const { success, limit, remaining, reset } = await loginRatelimit.limit(ip);

    if (!success) {
      const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
      const retryMinutes = Math.ceil(retryAfterSeconds / 60);
      return {
        error: `Terlalu banyak percobaan login. Coba lagi dalam ${retryMinutes} menit.`,
        rateLimited: true,
        retryAfter: retryAfterSeconds,
      };
    }

    console.log(
      `[loginAction] IP: ${ip} | Remaining attempts: ${remaining}/${limit}`
    );
  }

  try {
    // ── 2. Cari user di database ───────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });

    if (!user) {
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // ── 3. Verifikasi password ─────────────────────────────────────────────────
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // ── 4. Buat JWT token dengan format NextAuth v5 / Auth.js ─────────────────
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error("AUTH_SECRET tidak terkonfigurasi.");
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

    return {};
  } catch (err) {
    console.error("[loginAction] Error:", err);
    return { error: "Terjadi kesalahan server. Silakan coba lagi." };
  }
}
