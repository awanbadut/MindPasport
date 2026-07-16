import type { NextAuthConfig } from "next-auth";

// Konfigurasi NextAuth ringan yang kompatibel dengan Edge Runtime
// File ini TIDAK BOLEH mengimpor database (Prisma) atau bcrypt karena dijalankan di Middleware Edge Vercel.

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Diisi di auth.ts nanti
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;