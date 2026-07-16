# START HERE — Instruksi Utama untuk AI Coding Agent

Dokumen ini adalah pintu masuk. Baca file ini dulu sebelum menyentuh kode apa pun.

## Tentang proyek ini

Mind Passport adalah paspor kompetensi digital berbasis web yang membantu generasi muda memetakan potensi diri (Career DNA), menganalisis kesenjangan skill, menyusun roadmap pengembangan, melacak progres, dan menghasilkan skor kesiapan karier (Career Readiness Score), lalu menghubungkannya dengan rekomendasi karier dan industri berbasis AI.

Semua spesifikasi produk ada di file-file bernomor dalam folder ini. Jangan menebak-nebak fitur, skema data, atau formula — semua sudah didefinisikan eksplisit di dokumen terkait. Kalau ada yang benar-benar tidak dijelaskan, tandai sebagai asumsi di kode (komentar `// ASUMSI:`) alih-alih mengarang diam-diam.

## Urutan baca dokumen

Baca berurutan, jangan lompat, karena dokumen belakang mengasumsikan kamu sudah paham dokumen depan:

1. `00-START-HERE.md` — file ini
2. `01-overview-dan-tujuan.md` — konteks produk, siapa penggunanya, apa masalah yang diselesaikan
3. `02-arsitektur-teknis.md` — stack, struktur folder, konvensi kode
4. `03-database-schema.md` — skema Prisma lengkap, semua tabel dan relasi
5. `04-auth-dan-roles.md` — sistem autentikasi, role, proteksi route
6. `05-api-contract-overview.md` — daftar semua endpoint API dan konvensi request/response
7. `06` sampai `13` — spesifikasi tiap fitur (satu file = satu fitur), baca sesuai urutan implementasi di bawah
8. `14-integrasi-gemini-api.md` — cara integrasi Gemini API untuk semua fitur berbasis AI
9. `15-design-system-ui.md` — token desain, komponen, daftar halaman
10. `16-deployment-dan-environment.md` — environment variable, setup Vercel + Supabase/Neon
11. `17-testing-dan-acceptance-criteria.md` — checklist yang harus lulus sebelum fitur dianggap selesai

## Urutan implementasi yang disarankan

Bangun sesuai urutan ini, karena fitur belakang bergantung pada data dari fitur depan:

1. Setup proyek + database + auth (`02`, `03`, `04`)
2. Career DNA Assessment (`06`) — ini fondasi, fitur lain butuh hasil asesmen ini
3. Skill Gap Analysis (`07`) — butuh Career DNA (target karier) + data skill pengguna
4. Personalized Skill Roadmap (`08`) — butuh hasil Skill Gap Analysis
5. Skill Progress Tracker (`09`) — butuh Roadmap sebagai referensi aktivitas
6. Digital Competency Passport (`10`) — agregasi dari semua data di atas
7. Career Readiness Score (`11`) — dihitung dari data Progress Tracker + Passport
8. AI Career Navigator (`12`) — rekomendasi lanjutan, butuh semua data di atas
9. Industry Match Recommendation (`13`) — tahap paling akhir, butuh profil kompetensi lengkap

Jangan mulai fitur nomor besar sebelum fitur sebelumnya bisa menyimpan dan membaca data dari database dengan benar. Ini bukan disain UI-only — setiap fitur harus benar-benar tersambung ke database dan API.

## Aturan keras (jangan dilanggar)

- **Satu sumber kebenaran untuk skema data**: gunakan persis skema di `03-database-schema.md`. Jangan menambah/mengubah nama field secara bebas. Kalau butuh field baru, tambahkan lewat migration dan catat alasannya di komentar.
- **Formula Career Readiness Score wajib persis** seperti di `11-fitur-career-readiness-score.md`. Jangan diubah, dibulatkan beda, atau disederhanakan.
- **Jangan hardcode API key** di mana pun di kode. Semua kredensial lewat environment variable sesuai `16-deployment-dan-environment.md`.
- **Jangan bikin fitur AI berupa data dummy/statis** yang berpura-pura hasil AI. Semua yang dilabeli "AI-generated" di UI harus benar-benar memanggil Gemini API sesuai `14-integrasi-gemini-api.md`.
- **Validasi input di server, bukan cuma di client.** Semua endpoint API harus validasi ulang meskipun form frontend sudah validasi.
- **Setiap endpoint API harus mengecek kepemilikan data** (user hanya bisa akses/ubah datanya sendiri), kecuali endpoint admin yang didefinisikan eksplisit.
- Kalau ragu antara dua pendekatan implementasi dan dokumen tidak menjelaskan, pilih pendekatan paling sederhana yang tetap memenuhi acceptance criteria di `17`, dan tulis alasannya di commit message.

## Cara kerja tiap file fitur (06–13)

Tiap file fitur punya struktur yang sama supaya konsisten:

- **Tujuan fitur** — kenapa fitur ini ada, dari sudut pandang pengguna
- **Model data terkait** — field mana di `03` yang dipakai fitur ini
- **Alur pengguna (user flow)** — langkah demi langkah apa yang terjadi
- **Endpoint API** — daftar endpoint spesifik fitur ini (detail lengkap tetap merujuk ke `05`)
- **Logika bisnis / perhitungan** — rumus, aturan, atau logika AI yang dipakai
- **Kondisi khusus & edge case** — apa yang terjadi kalau data kosong, gagal, dsb.
- **Kriteria selesai** — checklist ringkas (checklist lengkap ada di `17`)

Jika kamu adalah AI agent yang membaca ini: jangan mulai coding sebelum membaca minimal file `01` sampai `05`. Setelah itu, kamu boleh membangun fitur demi fitur mengikuti urutan implementasi, membaca file fitur terkait tepat sebelum mengerjakannya.
