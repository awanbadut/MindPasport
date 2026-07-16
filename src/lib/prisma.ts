import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Singleton Prisma Client untuk Next.js (Prisma 7 dengan adapter)
// Mencegah multiple instances di development mode dengan HMR

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  // Prisma 7 menggunakan adapter untuk koneksi database
  // DATABASE_URL dipakai untuk runtime (bisa pooler/pgbouncer)
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // ASUMSI: Saat development tanpa .env, buat client tanpa adapter untuk type checking
    // Ini hanya untuk tipe - akan error saat runtime tanpa DATABASE_URL
    return new PrismaClient({
      log: ["error"],
    });
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
