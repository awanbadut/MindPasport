import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware murni tanpa import NextAuth/Prisma/bcrypt
// agar 100% aman dan kompatibel dengan Vercel Edge Runtime.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ===== Route publik yang tidak butuh login =====
  const alwaysPublic = [
    "/",
    "/login",
    "/register",
    "/api/auth", // NextAuth callback & session API endpoints
  ];
  const isAlwaysPublic = alwaysPublic.some(
    (r) => pathname === r || pathname.startsWith(r)
  );

  // Passport publik (slug sharing) tidak butuh login
  const isPublicPassport =
    pathname.startsWith("/passport/") &&
    !pathname.startsWith("/passport/qrcode");

  if (isAlwaysPublic || isPublicPassport) {
    return NextResponse.next();
  }

  // ===== Cek Session Cookie secara Manual =====
  // NextAuth v5 / Auth.js menggunakan salah satu dari cookie berikut:
  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-next-auth.session-token")?.value ??
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  // Tulis log nama cookie yang diterima ke Vercel runtime logs untuk debugging
  console.log(
    `[Middleware] Path: ${pathname} | Session Cookie Found: ${!!sessionToken}`
  );

  if (!sessionToken) {
    // Belum login — arahkan ke login dan simpan callbackUrl
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login — lanjutkan request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Jalankan middleware untuk semua route kecuali static assets & media
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
