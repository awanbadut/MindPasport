import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware Next.js 15 — ringan, 100% Edge-compatible
// Tidak mengimpor NextAuth/Prisma/bcrypt sama sekali.
// Cukup cek session cookie JWT yang diset oleh NextAuth.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Route yang selalu bisa diakses tanpa login
  const publicPrefixes = [
    "/login",
    "/register",
    "/api/auth",
    "/api/passport/public/",
  ];
  const isPublicPrefix = publicPrefixes.some((r) => pathname.startsWith(r));

  // Landing page
  const isLandingPage = pathname === "/";

  // Passport publik (slug sharing) tidak butuh login
  const isPublicPassport =
    pathname.startsWith("/passport/") &&
    !pathname.startsWith("/passport/qrcode");

  if (isLandingPage || isPublicPrefix || isPublicPassport) {
    return NextResponse.next();
  }

  // Cek session cookie NextAuth (JWT strategy)
  // NextAuth menyimpan JWT di salah satu dari dua cookie ini:
  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Jalankan untuk semua route kecuali asset statis Next.js
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
