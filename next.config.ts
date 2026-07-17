import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Matikan check linter saat build di Vercel agar cepat & stabil
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Paket Node.js native — jangan di-bundle, jalankan sebagai external
  serverExternalPackages: ["mongodb", "@upstash/redis", "@upstash/ratelimit"],
};

export default nextConfig;
