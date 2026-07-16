# 17 — Testing dan Acceptance Criteria

Checklist ini adalah gerbang terakhir. Sebuah fitur baru dianggap "selesai" kalau semua poin relevan di bawah lulus, bukan hanya karena UI-nya sudah mirip desain.

## Checklist lintas-fitur (berlaku untuk semua 8 fitur)

- [ ] Endpoint API mengembalikan format response konsisten (`success`/`error`) sesuai `05-api-contract-overview.md`
- [ ] Endpoint menolak akses tanpa session (401) kecuali yang memang publik
- [ ] Endpoint menolak akses ke data milik user lain (403), bukan malah mengembalikan datanya
- [ ] Semua input divalidasi Zod di server, bukan hanya di form frontend
- [ ] Halaman menampilkan `EmptyState` yang jelas ketika data belum ada, bukan crash atau halaman kosong putih
- [ ] Halaman menampilkan loading state (skeleton) saat fetch data, bukan flash konten kosong
- [ ] Responsif di layar mobile (tidak ada elemen terpotong/overflow rusak)

## Checklist khusus per fitur

**Career DNA Assessment (06)**
- [ ] Skor 5 dimensi terhitung matematis dengan benar dari jawaban mentah
- [ ] Insight & rekomendasi karier AI tersimpan, dan tetap ada fallback kalau AI gagal
- [ ] Retake tidak menciptakan duplikat data

**Skill Gap Analysis (07)**
- [ ] Formula gap, kategori gap, dan prioritas persis sesuai `07-fitur-skill-gap-analysis.md`
- [ ] `overallReadinessPercent` dihitung dari bobot, bukan rata-rata sederhana
- [ ] Hasil submit meng-upsert `UserSkill` pengguna

**Personalized Skill Roadmap (08)**
- [ ] Urutan tahap mengikuti prioritas gap (Sangat Prioritas dulu), bukan urutan acak dari AI
- [ ] Ada fallback template kalau Gemini gagal
- [ ] Status item bisa diupdate dan tersimpan

**Skill Progress Tracker (09)**
- [ ] CRUD entri berfungsi penuh dan hanya untuk data milik sendiri
- [ ] Entri dengan skill terkait menaikkan `UserSkill.currentScore` sesuai aturan cap 100
- [ ] Filter per tipe aktivitas berfungsi

**Digital Competency Passport (10)**
- [ ] Data yang tampil adalah agregasi real dari fitur lain, bukan data dummy
- [ ] Toggle publik/privat benar-benar mengontrol akses halaman publik
- [ ] Halaman publik tidak menampilkan data mentah asesmen atau breakdown skor detail

**Career Readiness Score (11)**
- [ ] Formula CSR diimplementasikan sebagai pure function dan hasilnya bisa diverifikasi manual dengan kalkulator
- [ ] Semua 6 komponen dihitung sesuai pemetaan data resmi di `11-fitur-career-readiness-score.md`, bukan angka acak/hardcode
- [ ] Kategori skor sesuai rentang resmi
- [ ] Riwayat skor tersimpan (bukan overwrite) dan grafik tren menampilkan data riwayat yang benar

**AI Career Navigator (12)**
- [ ] Rekomendasi benar-benar berasal dari panggilan Gemini real-time dengan konteks user yang sebenarnya
- [ ] Response Gemini divalidasi terhadap skema JSON sebelum disimpan
- [ ] Kegagalan API ditangani jujur (pesan error), tidak menampilkan data seolah-olah dari AI

**Industry Match Recommendation (13)**
- [ ] `matchPercent` dihitung matematis, konsisten dengan hasil yang bisa direproduksi manual
- [ ] Bagian naratif AI opsional dan tidak menghalangi fitur inti kalau gagal
- [ ] Ranking role terurut benar dari match tertinggi

## Uji end-to-end minimal sebelum serah terima ke klien

Jalankan skenario ini secara manual (atau otomatis kalau sempat setup Playwright/Cypress) sebagai smoke test akhir:

1. Registrasi user baru → otomatis diarahkan ke Career DNA Assessment
2. Isi & submit Career DNA Assessment → lihat hasil radar chart & rekomendasi karier
3. Pilih satu career role dari rekomendasi → lakukan Skill Gap Analysis
4. Generate roadmap dari hasil gap analysis
5. Tambah 2-3 entri di Skill Progress Tracker, termasuk yang terkait skill di roadmap
6. Hitung Career Readiness Score → verifikasi kategori yang muncul masuk akal berdasarkan data yang diinput
7. Buka halaman Digital Competency Passport → aktifkan mode publik → buka link publiknya di tab incognito (tanpa login) → pastikan data yang tampil sesuai batasan privasi
8. Minta rekomendasi dari AI Career Navigator → verifikasi rekomendasi relevan dengan gap yang tadi diisi
9. Buka Industry Match Recommendation → verifikasi role dengan skill yang sudah diisi tadi muncul dengan match percentage yang masuk akal
10. Logout → login ulang → pastikan semua data di atas masih tersimpan dan tampil dengan benar
