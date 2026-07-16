# 13 — Fitur: Industry Match Recommendation

## Tujuan fitur

Mencocokkan profil kompetensi pengguna dengan kebutuhan suatu karier/industri (`CareerRole`), menghasilkan persentase kecocokan dan daftar skill yang sudah cocok vs yang masih kurang — supaya pengguna tahu peluang karier mana yang paling realistis saat ini, bukan cuma yang paling diminati.

Ini mirip Skill Gap Analysis, tapi bedanya:
- **Skill Gap Analysis** = "buat saya jalan pengembangan menuju karier tujuan tertentu yang saya pilih sendiri" (fokus pada satu role, hasilnya roadmap)
- **Industry Match Recommendation** = "dari semua karier yang ada di sistem, mana yang paling cocok dengan kondisi saya sekarang" (fokus membandingkan ke banyak role sekaligus, hasilnya ranking, tidak menghasilkan roadmap)

## Model data terkait

`IndustryMatchResult` di `03-database-schema.md`.

## Perhitungan match percentage

Untuk setiap `CareerRole` yang dicek (`careerRoleId` spesifik dari request, atau semua `CareerRole` aktif kalau tidak dispesifikkan):

```
matchPercent = round( sum(bobot_i × min(skorPengguna_i, skorStandar_i)) / sum(bobot_i × skorStandar_i) × 100 )
```

Catatan: `min(skorPengguna_i, skorStandar_i)` dipakai (bukan skor pengguna mentah) supaya skill pengguna yang melebihi standar tidak mendongkrak persentase kecocokan secara tidak proporsional — kecocokan maksimal ke satu skill adalah 100% dari kebutuhan standar untuk skill tsb.

`matchingSkills` = daftar skill dengan `skorPengguna_i >= skorStandar_i × 0.8` (dianggap "cukup cocok", threshold 80% dari standar)
`missingSkills` = sisanya, diurutkan dari gap terbesar

Kalau user belum punya `UserSkill` untuk skill tertentu yang dibutuhkan role tsb, `skorPengguna_i = 0` untuk skill itu (dianggap belum punya kompetensi tsb sama sekali).

## Alur pengguna

1. Halaman ini menampilkan daftar semua `CareerRole` yang di-ranking berdasarkan `matchPercent`, dari yang paling cocok
2. User klik "Hitung Ulang" untuk memperbarui berdasarkan data skill terbaru mereka
3. Klik satu role untuk lihat detail: skill yang sudah cocok, skill yang masih kurang, dan tombol "Buat Skill Gap Analysis untuk role ini" (shortcut ke fitur 07 dengan role sudah terpilih otomatis)

## Peran AI di fitur ini

Perhitungan `matchPercent` sepenuhnya matematis (SAMA SEKALI TIDAK butuh AI, supaya konsisten dan bisa diaudit). Gemini hanya dipakai OPSIONAL untuk menulis ringkasan naratif singkat (1-2 kalimat) per hasil, misalnya: "Kamu punya kecocokan kuat di skill analitis untuk role ini, tapi masih perlu penguatan di tools visualisasi data." Kalau panggilan naratif ini gagal, cukup sembunyikan bagian teks naratif, JANGAN gagalkan perhitungan `matchPercent` yang murni matematis.

## Kondisi khusus

- Kalau tidak ada `CareerRole` sama sekali di database, tampilkan pesan kosong yang jelas, jangan crash.
- Simpan tiap hasil perhitungan sebagai baris baru `IndustryMatchResult` (riwayat), bukan overwrite, supaya user bisa lihat perubahan match percentage seiring waktu.

## Kriteria selesai

- [ ] Ranking career role berdasarkan match percentage yang dihitung matematis dan konsisten
- [ ] Detail matching skills vs missing skills tampil dengan benar
- [ ] Fitur tetap berfungsi penuh (perhitungan) walau bagian naratif AI gagal
- [ ] Ada shortcut ke Skill Gap Analysis dari hasil match
