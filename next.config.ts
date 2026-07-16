import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint dan TypeScript type check selama build Vercel
  // Type safety tetap dijaga oleh `npx tsc --noEmit` di lokal sebelum push
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
    "@prisma/adapter-pg",
    "pg",
    "pg-native",
    "bcryptjs",
  ],
};

export default nextConfig;
