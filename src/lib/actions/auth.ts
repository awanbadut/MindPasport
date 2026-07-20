"use server";

import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Login Server Action murni PostgreSQL (Prisma) + bcrypt + NextAuth JWT.
// Tanpa ketergantungan Redis atau MongoDB agar login 100% cepat dan lancar.

export async function loginAction(
  email: string,
  password: string
): Promise<{ error?: string; rateLimited?: boolean; retryAfter?: number }> {
  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  try {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Cari user di database PostgreSQL via Prisma
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });

    if (!user) {
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // 2. Verifikasi kata sandi dengan bcrypt
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // 3. Ambil AUTH_SECRET dari environment
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("[loginAction] AUTH_SECRET tidak dikonfigurasi.");
      return { error: "Konfigurasi server bermasalah (AUTH_SECRET). Hubungi administrator." };
    }

    const isProduction = process.env.NODE_ENV === "production";
    const cookieName = isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    // 4. Encode JWT session token
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

    // 5. Simpan token ke cookie browser
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
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Terjadi kesalahan server: ${msg}` };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("authjs.session-token");
  cookieStore.delete("__Secure-authjs.session-token");
}
