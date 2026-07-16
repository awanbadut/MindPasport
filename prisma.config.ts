import { defineConfig, env } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

// Prisma 7 + Neon Serverless: URL dikonfigurasi di sini untuk CLI (migrate, generate)
// Runtime connection menggunakan adapter di src/lib/prisma.ts
export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
