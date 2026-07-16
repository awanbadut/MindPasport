# 16 — Deployment dan Environment

## Target deployment

- Hosting app: **Vercel**
- Database: **Supabase** atau **Neon** (managed PostgreSQL) — pilih salah satu, keduanya kompatibel dengan Prisma

## Environment variables lengkap

Buat `.env.example` di root proyek:

```env
# Database (Supabase/Neon)
DATABASE_URL="postgresql://user:password@host:port/dbname?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:port/dbname"

# NextAuth
NEXTAUTH_SECRET="generate-dengan: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"   # ganti ke domain produksi saat deploy

# Gemini API
GEMINI_API_KEY="isi-dengan-api-key-dari-Google-AI-Studio"
```

Catatan:
- `DATABASE_URL` pakai connection pooling (pgbouncer) untuk runtime app di Vercel (serverless, banyak koneksi singkat)
- `DIRECT_URL` dipakai khusus untuk `prisma migrate` (butuh koneksi langsung, bukan lewat pooler)
- Kalau pakai Neon, formatnya mirip, sesuaikan dengan connection string yang diberikan dashboard Neon (biasanya juga menyediakan pooled & direct URL terpisah)

## Setup database (Supabase contoh)

1. Buat project baru di Supabase
2. Ambil connection string dari Project Settings → Database → Connection String (pilih mode "Transaction" untuk `DATABASE_URL`, mode "Session"/direct untuk `DIRECT_URL`)
3. Jalankan migration:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Setup Gemini API key

1. Buka Google AI Studio, buat API key baru
2. Simpan sebagai `GEMINI_API_KEY` di environment variable lokal (`.env`) dan di Vercel Project Settings → Environment Variables (jangan commit ke git)

## Langkah deploy ke Vercel

1. Push kode ke GitHub repository
2. Import project di Vercel dashboard, hubungkan ke repo
3. Set semua environment variable di atas di Vercel Project Settings (untuk environment Production dan Preview)
4. Build command default Next.js sudah cukup (`next build`), tapi tambahkan `postinstall` script di `package.json` untuk generate Prisma Client otomatis:
   ```json
   "scripts": {
     "postinstall": "prisma generate",
     "build": "prisma generate && next build"
   }
   ```
5. Setelah deploy pertama sukses, jalankan migration production sekali via CLI lokal yang terhubung ke `DIRECT_URL` production (jangan jalankan migrate otomatis di build step Vercel untuk menghindari race condition kalau ada multiple deployment bersamaan)

## Checklist sebelum dianggap "siap deploy"

- [ ] Semua environment variable terisi di Vercel (bukan hanya lokal)
- [ ] `NEXTAUTH_URL` sudah diganti ke domain produksi asli, bukan `localhost`
- [ ] `NEXTAUTH_SECRET` di produksi BEDA dari yang dipakai saat development (generate baru)
- [ ] Migration sudah dijalankan ke database production, dan seed data master (`Skill`, `CareerRole`, `IndustryStandardSkill`) sudah masuk
- [ ] Test login/register di environment production, bukan cuma lokal
- [ ] Test satu alur penuh fitur AI (Career DNA submit) di production untuk memastikan `GEMINI_API_KEY` produksi valid dan tidak kena rate limit
