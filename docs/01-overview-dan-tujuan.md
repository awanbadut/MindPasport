# 01 — Overview dan Tujuan Produk

## Nama produk
Mind Passport — Paspor Kompetensi Digital

## Masalah yang diselesaikan

Generasi muda (siswa SMA/SMK, mahasiswa, fresh graduate) mengumpulkan banyak sertifikat, pengalaman organisasi, proyek, dan pelatihan, tapi:

- Belum tahu potensi diri sendiri secara utuh (minat, karakter, kemampuan)
- Tidak tahu skill apa yang benar-benar dibutuhkan untuk karier tujuannya
- Ikut pelatihan secara acak tanpa arah yang jelas
- Tidak punya cara mengukur seberapa siap dirinya untuk masuk dunia kerja
- CV dan LinkedIn hanya menyimpan riwayat, tidak menganalisis atau merekomendasikan apa pun

Mind Passport menjawab ini dengan satu ekosistem digital yang mengintegrasikan: pemetaan potensi diri → analisis kesenjangan skill → roadmap pengembangan personal → pelacakan progres → dokumentasi kompetensi → skor kesiapan karier → rekomendasi karier dan industri berbasis AI.

## Pengguna utama (user persona)

- **Siswa/Mahasiswa** — pengguna utama. Mengisi asesmen, mengikuti roadmap, mencatat progres, membangun paspor kompetensi digital.
- **Guru BK / Dosen / Career Center** — melihat progres siswa/mahasiswa bimbingannya (opsional untuk versi awal, lihat catatan di `04-auth-dan-roles.md`).
- **Admin** — mengelola master data skill, standar kompetensi industri, dan memantau sistem.

Untuk versi pertama (yang akan dibangun sekarang), fokus utama adalah role **Pengguna (mahasiswa/siswa)** dan **Admin**. Role Guru BK/Career Center didefinisikan skemanya tapi implementasi penuh boleh menyusul — catat sebagai `// TODO fase 2` di kode kalau belum sempat.

## Delapan fitur utama (ringkasan)

| # | Fitur | Fungsi singkat |
|---|-------|----------------|
| 1 | Career DNA Assessment | Asesmen minat, bakat, kepribadian, nilai kerja → profil 5 dimensi (Direction, Nature, Ability, Career Fit, Growth Potential) |
| 2 | Skill Gap Analysis | Bandingkan skill pengguna vs standar industri untuk karier tujuan → daftar gap dan prioritas |
| 3 | Personalized Skill Roadmap | Rencana tahapan belajar personal berdasarkan hasil gap analysis |
| 4 | Skill Progress Tracker | Catat & pantau aktivitas pengembangan diri (pelatihan, proyek, magang, dst) |
| 5 | Digital Competency Passport | Dokumen identitas kompetensi digital, bisa dibagikan via QR/link |
| 6 | Career Readiness Score | Skor 0–100 berdasarkan formula berbobot dari beberapa komponen |
| 7 | AI Career Navigator | Rekomendasi pelatihan/magang/proyek/jalur karier berbasis AI (Gemini) |
| 8 | Industry Match Recommendation | Cocokkan profil pengguna dengan kebutuhan industri/lowongan |

Detail masing-masing fitur ada di file `06` sampai `13`.

## Alur kerja tingkat tinggi (high-level flow)

```
Registrasi/Login
      │
      ▼
Career DNA Assessment (wajib diisi pertama kali)
      │
      ▼
Pengguna pilih/punya tujuan karier?
   │Tidak → Eksplorasi minat & rekomendasi karier (dari hasil DNA)
   │Ya
      ▼
Skill Gap Analysis (skill saat ini vs standar industri tujuan)
      │
      ▼
Personalized Skill Roadmap (rencana tahapan belajar)
      │
      ▼
Pengguna jalani aktivitas (pelatihan/proyek/magang/organisasi)
      │
      ▼
Skill Progress Tracker mencatat tiap aktivitas
      │
      ▼
Digital Competency Passport terbentuk otomatis dari rekam jejak
      │
      ▼
Career Readiness Score dihitung & diperbarui berkala
      │
      ▼
AI Career Navigator + Industry Match memberi rekomendasi lanjutan
```

## Non-goals (bukan tujuan versi ini)

- Bukan job board / marketplace lowongan kerja penuh (Industry Match cukup rekomendasi kecocokan, bukan sistem lamar-kerja lengkap)
- Bukan sistem pembelajaran (LMS) — Mind Passport merekomendasikan pelatihan, tidak menghosting konten kursus
- Bukan aplikasi mobile native — cukup web app yang responsif

## Referensi sumber

Semua kebutuhan fitur di atas diturunkan dari esai "Mind Passport: Paspor Kompetensi Digital untuk Menunjang Pengembangan Karier" (Nahdah Humairah Nasrun Hamdat). Kalau ada detail yang tidak jelas dan tidak dijelaskan di dokumen `06`–`13`, jangan buka ulang esai — cukup buat asumsi masuk akal dan tandai dengan `// ASUMSI:` di kode.
