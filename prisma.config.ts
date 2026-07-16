import { defineConfig, env } from "prisma/config";
import * as dotenv from "dotenv";

// Load environment variables dari .env file
dotenv.config();

// Konfigurasi database untuk Prisma 7
export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
