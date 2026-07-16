import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Paket-paket Node.js native yang TIDAK boleh di-bundle oleh webpack Next.js 15
  // Prisma dan pg memerlukan native bindings yang hanya tersedia di runtime Node.js
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "pg-native",
    "bcryptjs",
  ],
};

export default nextConfig;
