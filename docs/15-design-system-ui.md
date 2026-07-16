# 15 — Design System & UI

## Prinsip visual

Nuansa profesional-modern seperti dashboard produktivitas (bukan playful/kartun) — target pengguna adalah pelajar/mahasiswa serius soal karier mereka, tapi tetap ramah dan tidak kaku seperti software korporat lama. Rujuk tampilan Lampiran 1 esai (Career DNA Assessment, Skill Gap Analysis, Digital Competency Passport) sebagai acuan kepadatan informasi & gaya kartu (card-based layout, sidebar kiri, konten utama di kanan).

## Palet warna (Tailwind config)

| Token | Hex | Pemakaian |
|-------|-----|-----------|
| `primary` | `#4F46E5` (indigo) | Tombol utama, highlight, aktif sidebar item |
| `primary-dark` | `#3730A3` | Hover state primary |
| `secondary` | `#0EA5E9` (sky) | Aksen sekunder, link, badge info |
| `success` | `#16A34A` | Skor tinggi, status "done", "Sangat Siap" |
| `warning` | `#F59E0B` | Skor sedang, status "in-progress", "Cukup Siap" |
| `danger` | `#DC2626` | Gap tinggi, status gagal, "Belum Siap" |
| `neutral-50` sampai `neutral-900` | grayscale Tailwind default | Background, teks, border |

Jangan pakai warna acak di luar palet ini di komponen manapun — semua warna status (kategori gap, kategori readiness score, prioritas roadmap) dipetakan konsisten:

| Kategori | Warna |
|----------|-------|
| Belum Siap / Sangat Prioritas / Tinggi (gap) | `danger` |
| Berkembang / Prioritas / Sedang (gap) | `warning` |
| Cukup Siap / Cukup Prioritas / Rendah (gap) | `secondary` |
| Sangat Siap / Dipertahankan / Sangat Rendah (gap) | `success` |

## Tipografi

- Font: `Inter` (via `next/font/google`), fallback system sans-serif
- Heading halaman: `text-2xl font-semibold`
- Sub-heading kartu: `text-lg font-medium`
- Body: `text-sm text-neutral-700`
- Angka skor besar (radar chart, readiness score): `text-4xl font-bold`

## Layout dasar

- Sidebar kiri tetap (desktop) berisi navigasi ke 8 fitur + dashboard, collapse jadi bottom nav atau hamburger di mobile
- Navbar atas: nama user, avatar inisial, notifikasi (opsional), tombol logout
- Konten utama: max-width container dengan padding konsisten (`px-6 py-8`)
- Semua kartu (`Card` component): `rounded-xl border border-neutral-200 shadow-sm bg-white p-6`

## Daftar halaman lengkap

| Route | Halaman | Fitur terkait |
|-------|---------|----------------|
| `/login`, `/register` | Auth | 04 |
| `/dashboard` | Ringkasan semua fitur: skor readiness terbaru, progress roadmap aktif, rekomendasi terbaru | Semua |
| `/career-dna` | Wizard kuesioner + halaman hasil (radar chart, top traits, rekomendasi karier) | 06 |
| `/skill-gap` | Pilih role → isi skor skill → tabel hasil gap | 07 |
| `/skill-gap/history` | Riwayat analisis sebelumnya | 07 |
| `/roadmap` | Timeline roadmap aktif dengan checklist | 08 |
| `/roadmap/history` | Roadmap yang diarsipkan | 08 |
| `/progress` | List + form tambah aktivitas, filter per tipe | 09 |
| `/passport` | Halaman Digital Competency Passport (privat, milik sendiri) dengan QR code & toggle publik | 10 |
| `/passport/[slug]` | Halaman publik passport (tanpa layout dashboard, tanpa sidebar) | 10 |
| `/readiness-score` | Skor terbaru + breakdown 6 komponen + grafik tren | 11 |
| `/navigator` | Kartu-kartu rekomendasi AI + tombol minta rekomendasi baru | 12 |
| `/industry-match` | Ranking career role berdasarkan kecocokan | 13 |
| `/admin/skills`, `/admin/career-roles` | Panel admin master data (role ADMIN saja) | 04 |

## Komponen inti yang perlu dibuat (`src/components/ui/`)

`Button`, `Card`, `Input`, `Select`, `Badge` (dengan varian warna sesuai kategori di atas), `ProgressBar`, `Modal`, `Tabs`, `Table`, `EmptyState` (untuk kondisi data kosong, dipakai di banyak fitur), `Skeleton` (loading state)

## Komponen chart (`src/components/charts/`)

- `RadarChart5Dimensi` — Career DNA (Recharts `RadarChart`)
- `SkillGapBarChart` — bar chart horizontal skor pengguna vs standar per skill (Recharts `BarChart`)
- `ReadinessScoreLineChart` — tren skor dari waktu ke waktu (Recharts `LineChart`)
- `ReadinessScoreGauge` — tampilan skor terbaru berbentuk gauge/donut sederhana

## Aksesibilitas & responsif

- Semua form wajib label eksplisit (bukan hanya placeholder)
- Kontras warna teks minimal WCAG AA
- Layout mobile-first: sidebar jadi bottom navigation di layar < 768px
- Semua tabel data (skill gap, progress) harus scroll horizontal di mobile, bukan overflow rusak
