# 08 — Fitur: Personalized Skill Roadmap

## Tujuan fitur

Menyusun rencana pengembangan skill yang personal dan bertahap, berdasarkan hasil Skill Gap Analysis, supaya pengguna tidak mengikuti pelatihan secara acak.

## Model data terkait

`SkillRoadmap` (header) + `RoadmapItem[]` (tahapan). Lihat `03-database-schema.md`.

## 8 tahap standar (dari esai, Lampiran 4) — pakai sebagai kerangka roadmap

| Tahap | Fokus | Output yang diharapkan |
|-------|-------|--------------------------|
| 1 | Pemetaan tujuan karier | Tujuan karier awal yang jelas (dari Career DNA) |
| 2 | Identifikasi skill yang dimiliki | Daftar kompetensi awal user |
| 3 | Analisis skill gap | Daftar skill kuat & yang perlu ditingkatkan (dari fitur 07) |
| 4 | Penyusunan prioritas belajar | Urutan skill berdasarkan prioritas (Sangat Prioritas dulu) |
| 5 | Rekomendasi aktivitas pengembangan | Pelatihan/kursus/proyek/magang/kompetisi/organisasi yang relevan per skill |
| 6 | Pelacakan progres skill | Terhubung ke fitur Skill Progress Tracker (08) |
| 7 | Evaluasi kesiapan karier | Terhubung ke Career Readiness Score (11) |
| 8 | Pembaruan roadmap | Roadmap diperbarui berkala sesuai progres |

Tahap 1–4 dihasilkan otomatis saat generate roadmap. Tahap 5 berisi item-item konkret (`RoadmapItem`) yang bisa dicentang user. Tahap 6–8 bukan bagian dari data roadmap itu sendiri, melainkan alur ke fitur lain — jangan buat field terpisah untuk itu di `SkillRoadmap`.

## Alur pengguna

1. User yang sudah punya minimal satu `SkillGapAnalysis` bisa klik "Buat Roadmap" dari hasil analisis tersebut
2. Server ambil `gapDetails` dari analisis tersebut, urutkan berdasarkan prioritas (Sangat Prioritas → Prioritas → Cukup Prioritas), lalu kirim ke Gemini untuk:
   - Menyusun stage/tahapan belajar yang logis (skill dasar dulu sebelum skill lanjutan, kalau ada dependensi yang jelas)
   - Menulis deskripsi tiap tahap dan rekomendasi aktivitas konkret (nama jenis pelatihan/kursus, bukan link ke platform spesifik kecuali diminta lain)
3. Simpan sebagai `SkillRoadmap` + banyak `RoadmapItem` (satu item per skill/tahap)
4. Tampilkan sebagai timeline vertikal, tiap item punya checkbox status (`todo`/`in-progress`/`done`)
5. User bisa update status item kapan saja (`PATCH /api/roadmap/item/[id]`) — ini nantinya dibaca oleh Career Readiness Score sebagai bagian dari "konsistensi pengembangan"

## Aturan penyusunan prioritas item

Urutan `stageNumber` HARUS mengikuti urutan prioritas dari `SkillGapAnalysis.gapDetails`:
1. Semua skill dengan prioritas "Sangat Prioritas" duluan
2. Lalu "Prioritas"
3. Lalu "Cukup Prioritas"
4. Skill "Dipertahankan" TIDAK perlu jadi item roadmap (sudah cukup baik, tidak butuh pengembangan) — kecuali user secara eksplisit ingin memasukkannya

Gemini hanya boleh mengubah *deskripsi dan rekomendasi aktivitas*, bukan mengubah urutan prioritas yang sudah ditentukan secara matematis oleh fitur Skill Gap Analysis.

## Kondisi khusus

- Kalau panggilan Gemini gagal, tetap buat roadmap dengan deskripsi & rekomendasi aktivitas generik berbasis template per kategori skill (fallback, jangan biarkan fitur gagal total karena AI down). Tandai di kode: `// FALLBACK: template statis karena Gemini gagal`.
- Satu `SkillGapAnalysis` idealnya hanya menghasilkan satu roadmap aktif — kalau user generate ulang, roadmap lama boleh diarsipkan (`status: "archived"`), bukan dihapus.

## Kriteria selesai

- [ ] Roadmap ter-generate otomatis dari hasil skill gap analysis
- [ ] Urutan tahap mengikuti prioritas gap yang sudah dihitung
- [ ] User bisa update status tiap item
- [ ] Ada fallback kalau Gemini API gagal
