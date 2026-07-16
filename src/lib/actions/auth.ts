"use server";

import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Login Server Action — bypass NextAuth CSRF sepenuhnya.
// Kami verifikasi kredensial secara manual, lalu buat JWT dengan format yang sama
// persis seperti yang dihasilkan NextAuth v5, dan set cookie sesi secara langsung.
// Cara ini 100% kompatibel dengan auth() di Server Components dan middleware.

export async function loginAction(
  email: string,
  password: string
): Promise<{ error?: string }> {
  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  try {
    // 1. Cari user di database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });

    if (!user) {
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // 2. Verifikasi password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
    }

    // 3. Buat JWT token dengan format NextAuth v5
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error("AUTH_SECRET tidak terkonfigurasi.");
    }

    // Nama cookie sesuai konvensi Auth.js v5 (salt dipakai untuk encode)
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
        exp: nowSeconds + 30 * 24 * 60 * 60, // 30 hari
      },
      secret,
      salt: cookieName, // Auth.js v5 pakai cookie name sebagai salt
      maxAge: 30 * 24 * 60 * 60,
    });

    // 4. Set cookie sesi
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
