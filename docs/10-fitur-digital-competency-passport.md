# 10 — Fitur: Digital Competency Passport

## Tujuan fitur

Menyusun seluruh pencapaian pengguna (profil potensi, skill, pengalaman, sertifikat, proyek) menjadi satu dokumen digital yang utuh dan bisa dibagikan lewat QR Code atau tautan, mirip tampilan "Digital Competency Passport" di Lampiran 1 esai.

## Model data terkait

`CompetencyPassport` (header/metadata) — datanya sendiri adalah **agregasi read-only** dari model lain (`CareerDNA`, `UserSkill`, `ProgressEntry`, `ReadinessScoreHistory`), bukan disalin ulang jadi tabel sendiri.

## Alur pengguna

1. Passport otomatis dibuat (`isPublic: false` secara default) saat user pertama kali mengakses halaman ini, dengan `passportNumber` format `MP-YYYY-MM-XXXXXX` (contoh: `MP-2026-07-000782`) dan `publicSlug` acak (misal nanoid 12 karakter)
2. Halaman menampilkan (baca dari agregasi, bukan input baru):
   - Info identitas: nama, institusi, level pendidikan, nomor passport, tanggal terbit
   - Ringkasan profil kompetensi: jumlah skill tercatat, level kompetensi dominan (ambil dari `ReadinessScoreHistory` terbaru → kategori), jumlah pencapaian/badge
   - Daftar sertifikat terverifikasi (dari `ProgressEntry` bertipe `certificate`/`training` dengan `verified: true`)
   - Daftar pengalaman (dari `ProgressEntry` semua tipe, terbaru dulu)
   - Daftar skill utama beserta level (dari `UserSkill`, urutkan skor tertinggi dulu)
   - QR Code yang mengarah ke `/passport/[publicSlug]` (halaman publik)
3. User bisa toggle `isPublic` (aktifkan/nonaktifkan link berbagi) dan unduh sebagai PDF (opsional untuk versi awal — kalau belum sempat, cukup tombol "Unduh Laporan" yang generate PDF sederhana dari data yang tampil, gunakan library seperti `@react-pdf/renderer` atau render halaman ke PDF via `puppeteer` kalau infrastruktur memungkinkan; kalau tidak sempat, tandai `// TODO: export PDF`)

## Halaman publik (`/passport/[slug]`)

- Diakses tanpa login
- Hanya tampil kalau `isPublic: true`, kalau tidak tampilkan halaman "Passport ini bersifat privat"
- Tampilkan versi terbatas: identitas dasar (nama, institusi), ringkasan skor kesiapan karier (kategori saja, bukan breakdown detail), daftar skill utama, daftar sertifikat terverifikasi. **Jangan** tampilkan data mentah asesmen (`rawAnswers` Career DNA) atau riwayat lengkap progress di halaman publik ini — cukup ringkasan.

## Format passport number

```
MP-{tahun}-{bulan 2 digit}-{6 digit sequential/random padded}
```
Contoh: `MP-2026-07-000782`. Generate saat passport pertama kali dibuat, jangan diubah lagi setelahnya (identitas permanen).

## Kondisi khusus

- Kalau user belum punya `CareerDNA` sama sekali, halaman passport tetap bisa diakses tapi tampilkan bagian yang kosong dengan ajakan "Lengkapi Career DNA Assessment untuk melengkapi passport-mu" alih-alih error.
- `publicSlug` harus unik — kalau collision saat generate, retry dengan slug baru.

## Kriteria selesai

- [ ] Passport otomatis terbentuk dari agregasi data lintas fitur
- [ ] QR code dan link publik berfungsi
- [ ] Toggle publik/privat berfungsi dan dihormati di halaman publik
- [ ] Halaman publik tidak membocorkan data mentah/sensitif
