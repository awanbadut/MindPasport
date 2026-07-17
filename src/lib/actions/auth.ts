"use server";

import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Buat JWT token yang kompatibel dengan NextAuth v5 / Auth.js
// menggunakan jose (sudah jadi dependency next-auth) secara langsung
// Format: JWE dir + A256CBC-HS512 dengan HKDF key derivation (sama persis dengan next-auth)
async function createSessionToken(
  payload: Record<string, unknown>,
  secret: string,
  salt: string
): Promise<string> {
  const { EncryptJWT } = await import("jose");
  const { hkdfSync } = await import("crypto");

  // Auth.js v5 key derivation: 64 bytes untuk A256CBC-HS512
  // Info string harus sama persis dengan @auth/core
  const derivedKey = hkdfSync(
    "sha256",
    Buffer.from(secret),
    Buffer.from(salt),
    `Auth.js Generated Encryption Key (${salt})`,
    64 // A256CBC-HS512 = 512-bit = 64 bytes
  );

  const now = Math.floor(Date.now() / 1000);

  return new EncryptJWT({ ...payload })
    .setProtectedHeader({ alg: "dir", enc: "A256CBC-HS512" })
    .setIssuedAt(now)
    .setExpirationTime(now + 30 * 24 * 60 * 60)
    .setJti(crypto.randomUUID())
    .encrypt(new Uint8Array(derivedKey)); // Uint8Array, bukan CryptoKey
}

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
    ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerStore.get("x-real-ip") ??
      "anonymous";
    userAgent = headerStore.get("user-agent") ?? "unknown";
  } catch { /* tidak kritis */ }

  // ── 1. Rate Limiting (lazy, tidak crash jika Redis error) ────────────────────
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
  } catch {
    // Redis error → skip rate limiting, lanjutkan login
  }

  // ── 2. Verifikasi kredensial ─────────────────────────────────────────────────
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

    // ── 3. Buat session token ─────────────────────────────────────────────────
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return { error: "Konfigurasi server bermasalah (AUTH_SECRET missing)." };
    }

    const isProduction = process.env.NODE_ENV === "production";
    const cookieName = isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    const token = await createSessionToken(
      { sub: user.id, id: user.id, name: user.name, email: user.email, role: user.role },
      secret,
      cookieName
    );

    // ── 4. Set cookie ─────────────────────────────────────────────────────────
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    // ── 5. Log sukses ke MongoDB ──────────────────────────────────────────────
    void writeLog({ email: user.email, ip, userAgent, success: true, userId: user.id, role: user.role });

    return {};

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[loginAction] ERROR:", msg);
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
