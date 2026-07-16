# 04 — Autentikasi dan Roles

## Metode auth

NextAuth.js (Auth.js) dengan **Credentials Provider** (email + password), Prisma Adapter untuk session storage, strategi session **JWT** (bukan database session, biar sederhana).

## Alur registrasi

1. User mengisi form: nama, email, password, konfirmasi password, level pendidikan (opsional), institusi (opsional)
2. Validasi server (Zod): email format valid & unik, password minimal 8 karakter mengandung huruf dan angka
3. Hash password dengan bcrypt (10 salt rounds), simpan `User` baru dengan `role: USER`
4. Auto-login setelah registrasi berhasil (buat session langsung)
5. Redirect ke `/career-dna` (bukan ke `/dashboard`) — karena Career DNA Assessment wajib diisi dulu di kunjungan pertama

## Alur login

1. Form email + password
2. Cocokkan hash password
3. Kalau gagal, tampilkan pesan generic "Email atau password salah" (jangan bocorkan mana yang salah)
4. Kalau berhasil, buat JWT session, redirect ke `/dashboard` jika `CareerDNA` sudah ada, atau ke `/career-dna` jika belum

## Proteksi route

- Semua route di grup `(dashboard)` wajib login. Gunakan middleware Next.js (`middleware.ts`) untuk redirect ke `/login` kalau tidak ada session.
- Semua route API di `/api/**` (kecuali `/api/auth/*` dan endpoint publik passport di bawah) wajib mengecek session lewat `getServerSession`.
- Endpoint yang **publik tanpa login** (untuk fitur share passport via QR/link):
  - `GET /api/passport/public/[slug]` — menampilkan data Digital Competency Passport yang `isPublic: true` saja, versi terbatas (tanpa data mentah asesmen)

## Roles

| Role | Akses |
|------|-------|
| `USER` | Akses penuh ke fitur miliknya sendiri (semua 8 fitur), tidak bisa lihat data user lain |
| `MENTOR` | (Fase 2) Bisa melihat progress & readiness score dari user yang terhubung sebagai bimbingannya. Skema relasi mentor-mentee belum didefinisikan di `03-database-schema.md` — kalau diimplementasikan, tambahkan model `MentorLink` dan catat sebagai penambahan skema |
| `ADMIN` | CRUD terhadap master data `Skill`, `CareerRole`, `IndustryStandardSkill`. Tidak otomatis bisa melihat data pribadi user (privacy by design) kecuali untuk keperluan support dengan audit log |

Untuk versi pertama, implementasikan penuh `USER` dan `ADMIN`. `MENTOR` cukup didefinisikan di enum, UI dan endpoint-nya boleh menyusul (tandai `// TODO fase 2`).

## Keamanan tambahan

- Rate limit endpoint login/register (misal maksimal 10 percobaan per menit per IP) — kalau tidak ada infrastruktur rate-limit siap pakai, minimal tambahkan delay/backoff sederhana atau gunakan middleware seperti `@upstash/ratelimit` jika Redis tersedia; kalau tidak, catat sebagai `// TODO: rate limiting` dan jangan blokir progres pengembangan karena ini.
- Jangan pernah mengembalikan `passwordHash` dalam response API mana pun, termasuk endpoint admin.
- CSRF: NextAuth sudah menangani untuk endpoint bawaannya. Untuk endpoint custom yang mengubah data, pastikan hanya menerima method yang sesuai (POST/PATCH/DELETE) dan session valid.
