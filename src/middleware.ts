import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware ringan untuk proteksi route — TANPA NextAuth/Prisma/bcrypt
// agar 100% kompatibel dengan Edge Runtime Vercel.
// Cukup cek keberadaan session cookie JWT yang diset oleh NextAuth.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ===== Route yang SELALU bisa diakses tanpa login =====
  const alwaysPublic = [
    "/",            // Landing page
    "/login",
    "/register",
    "/api/auth",    // NextAuth internal endpoints
    "/api/passport/public/", // Public passport sharing
  ];
  const isAlwaysPublic = alwaysPublic.some((r) => pathname === r || pathname.startsWith(r));

  // Passport publik (slug sharing) tidak butuh login
  const isPublicPassport =
    pathname.startsWith("/passport/") && !pathname.startsWith("/passport/qrcode");

  if (isAlwaysPublic || isPublicPassport) {
    return NextResponse.next();
  }

  // ===== Cek session cookie NextAuth (JWT strategy) =====
  // NextAuth menyimpan JWT di salah satu dari dua nama cookie berikut:
  // - next-auth.session-token (development/HTTP)
  // - __Secure-next-auth.session-token (production/HTTPS)
  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    // Belum login — redirect ke halaman login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login — lanjutkan ke route yang diminta
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Jalankan middleware untuk semua route KECUALI asset statis Next.js
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};