import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Middleware menggunakan auth.config yang TIDAK mengimpor Prisma/bcrypt
// agar kompatibel dengan Edge Runtime Vercel
export default auth((req: NextRequest & { auth: { user?: { id?: string; role?: string } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Route publik yang tidak butuh login
  const publicRoutes = ["/login", "/register", "/api/auth", "/api/passport/public/"];
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

  // Passport publik juga tidak butuh login
  const isPublicPassport =
    pathname.startsWith("/passport/") && !pathname.startsWith("/passport/qrcode");

  if (isPublicRoute || isPublicPassport) {
    return NextResponse.next();
  }

  // Jika belum login, redirect ke /login
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Proteksi admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Akses ditolak" } },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};