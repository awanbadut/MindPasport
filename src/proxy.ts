import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Proxy (sebelumnya "middleware") — Next.js 16 menggunakan nama file proxy.ts
// dan nama fungsi export "proxy".
// Ringan dan 100% Edge-compatible — tidak mengimpor NextAuth/Prisma/bcrypt.

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ===== Route yang SELALU bisa diakses tanpa login =====
  const alwaysPublic = [
    "/",
    "/login",
    "/register",
    "/api/auth",
    "/api/passport/public/",
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

  // ===== Cek session cookie NextAuth (JWT strategy) =====
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};