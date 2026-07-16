import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import type { Role } from "@prisma/client";

// auth.ts hanya dijalankan di Node.js runtime (API Routes, Server Components)
// BUKAN di middleware (Edge Runtime)
// CATATAN: PrismaAdapter DIHAPUS karena kita pakai JWT strategy (bukan database sessions).
// PrismaAdapter hanya dibutuhkan untuk OAuth providers atau database sessions,
// yang keduanya tidak kita gunakan. Tanpa adapter, login Credentials + JWT bekerja sempurna.
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // adapter: PrismaAdapter(prisma), // <-- DIHAPUS: menyebabkan error karena tabel Account/Session tidak ada di DB
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});

// Augment next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  }
}