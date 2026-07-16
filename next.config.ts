import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Matikan check linter saat build di Vercel agar cepat & stabil
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
