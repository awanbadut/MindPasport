# 02 — Arsitektur Teknis

## Stack

| Layer | Teknologi | Catatan |
|-------|-----------|---------|
| Framework | Next.js 14+ (App Router) | Full-stack: frontend + API routes dalam satu proyek |
| Bahasa | TypeScript | Wajib, jangan pakai `.js` biasa. `strict: true` di `tsconfig.json` |
| Styling | Tailwind CSS | Sesuai token desain di `15-design-system-ui.md` |
| Database | PostgreSQL | Di-host di Supabase atau Neon (lihat `16-deployment-dan-environment.md`) |
| ORM | Prisma | Skema di `03-database-schema.md` |
| Auth | NextAuth.js (Auth.js) dengan Credentials Provider + Prisma Adapter | JWT session strategy |
| AI Provider | Google Gemini API | Lihat `14-integrasi-gemini-api.md` |
| Validasi | Zod | Semua input API divalidasi pakai Zod schema |
| Grafik/Chart | Recharts | Untuk radar chart Career DNA, bar chart skill gap, dsb |
| State di client | React Server Components sebisa mungkin + `useState`/`useReducer` untuk interaktivitas lokal | Hindari state management library tambahan kecuali benar-benar perlu |
| Deployment | Vercel | Managed Postgres via Supabase/Neon |

## Struktur folder proyek

```
mind-passport/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                     # data awal: master skill, standar industri
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # sidebar + navbar, proteksi auth
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── career-dna/page.tsx
│   │   │   ├── skill-gap/page.tsx
│   │   │   ├── roadmap/page.tsx
│   │   │   ├── progress/page.tsx
│   │   │   ├── passport/page.tsx
│   │   │   ├── readiness-score/page.tsx
│   │   │   ├── navigator/page.tsx
│   │   │   └── industry-match/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── career-dna/route.ts
│   │   │   ├── skill-gap/route.ts
│   │   │   ├── roadmap/route.ts
│   │   │   ├── progress/route.ts
│   │   │   ├── passport/route.ts
│   │   │   ├── readiness-score/route.ts
│   │   │   ├── navigator/route.ts
│   │   │   └── industry-match/route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                     # komponen dasar: Button, Card, Input, Badge, dst
│   │   ├── charts/                 # RadarChart, GapBarChart, dst
│   │   └── layout/                 # Sidebar, Navbar, PageHeader
│   ├── lib/
│   │   ├── prisma.ts               # singleton Prisma client
│   │   ├── auth.ts                 # config NextAuth
│   │   ├── gemini.ts               # wrapper panggilan Gemini API
│   │   ├── scoring.ts              # semua formula perhitungan (readiness score, gap, dst)
│   │   └── validation/             # semua Zod schema, satu file per domain
│   └── types/
│       └── index.ts                # shared TypeScript types
├── .env.example
├── package.json
└── tsconfig.json
```

## Konvensi kode

- Nama file komponen React: `PascalCase.tsx`. Nama file utilitas: `camelCase.ts`.
- Semua endpoint API mengembalikan bentuk response yang konsisten:
  ```ts
  // sukses
  { success: true, data: <payload> }
  // gagal
  { success: false, error: { code: string, message: string } }
  ```
- Semua perhitungan skor/formula (Career Readiness Score, Skill Gap) HARUS ditulis sebagai fungsi murni (pure function) di `src/lib/scoring.ts`, bukan ditulis ulang di banyak tempat. Fitur lain memanggil fungsi ini.
- Setiap route API di `src/app/api/**/route.ts` wajib:
  1. Cek sesi login (kecuali endpoint publik seperti register/login)
  2. Validasi body/query dengan Zod
  3. Cek kepemilikan data sebelum read/write
  4. Bungkus logic dalam try/catch, kembalikan error terformat di atas
- Gunakan Server Components untuk halaman yang murni menampilkan data. Gunakan Client Components (`"use client"`) hanya untuk bagian yang butuh interaktivitas (form, chart interaktif, toggle).

## Environment variables yang dibutuhkan

Didaftar lengkap di `16-deployment-dan-environment.md`, ringkasannya:

```
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GEMINI_API_KEY=
```

## Package inti yang perlu di-install

```bash
npm install next react react-dom typescript
npm install @prisma/client next-auth@beta @auth/prisma-adapter
npm install -D prisma
npm install zod bcryptjs
npm install recharts
npm install -D tailwindcss postcss autoprefixer @types/bcryptjs
npm install qrcode
npm install @google/generative-ai
```

Sesuaikan versi dengan yang terbaru saat proyek mulai dibangun (agent boleh cek versi stabil terbaru masing-masing package).
