# 07 — Fitur: Skill Gap Analysis

## Tujuan fitur

Membandingkan skill yang sudah dimiliki pengguna dengan skill yang dibutuhkan pada karier tujuan tertentu, menghasilkan daftar kesenjangan (gap) dan prioritas pengembangan.

## Model data terkait

- `SkillGapAnalysis` — hasil analisis (ringkasan)
- `IndustryStandardSkill` — standar bobot & skor per skill untuk tiap `CareerRole` (master data)
- `UserSkill` — skor skill pengguna saat ini (self-assessment atau dari aktivitas lain)

## Alur pengguna

1. User pilih karier tujuan dari dropdown (`GET /api/career-roles`)
2. Sistem tampilkan daftar skill yang relevan untuk role tersebut (dari `IndustryStandardSkill`)
3. User isi skor dirinya sendiri untuk tiap skill (self-assessment 0–100), ATAU sistem otomatis mengambil skor dari `UserSkill` yang sudah ada (kalau user pernah isi sebelumnya) sebagai default yang bisa diedit
4. Submit → server hitung gap per skill dan gap total
5. Tampilkan hasil: skor kesesuaian keseluruhan, total gap, tabel detail per skill dengan kategori gap dan prioritas (mirip Lampiran 3 esai dan tampilan "Skill Gap Analysis" di Lampiran 1)

## Formula perhitungan (WAJIB PERSIS SEPERTI INI)

Untuk setiap skill *i* pada role yang dipilih:

```
gap_i = skorPengguna_i - skorStandarIndustri_i
```

Kategori gap berdasarkan besarnya `|gap_i|` (nilai absolut):

| |gap| | Kategori Gap |
|-------|--------------|
| 0 – 4 | Sangat Rendah |
| 5 – 9 | Rendah |
| 10 – 19 | Sedang |
| ≥ 20 | Tinggi |

Kalau `gap_i` positif (skor pengguna di atas standar), kategori tetap dihitung dari nilai absolut, tapi prioritas pengembangan jadi:

| Kondisi | Prioritas Pengembangan |
|---------|------------------------|
| gap ≥ 0 (skor pengguna ≥ standar) | Dipertahankan |
| gap negatif, kategori Sangat Rendah/Rendah | Cukup Prioritas |
| gap negatif, kategori Sedang | Prioritas |
| gap negatif, kategori Tinggi | Sangat Prioritas |

Ini konsisten dengan Lampiran 3 esai — contoh: Microsoft Excel gap +5 → "Dipertahankan"; SQL gap -25 → "Sangat Prioritas"; Statistik gap -10 → "Cukup Prioritas" (catatan: di esai kategori gap -10 ditulis "Rendah" dengan prioritas "Cukup Prioritas" — ikuti tabel kategori di atas sebagai aturan resmi, karena esai punya sedikit inkonsistensi penamaan; yang penting arah logikanya sama).

**Skor kesesuaian keseluruhan (overallReadinessPercent):**

```
overallReadinessPercent = round( sum(bobot_i * skorPengguna_i) / sum(bobot_i * skorStandarIndustri_i) * 100 )
```

`bobot_i` adalah `weightPercent` dari `IndustryStandardSkill` (total bobot semua skill pada satu role idealnya 100, tapi kode tidak boleh mengasumsikan itu — selalu hitung berdasarkan proporsi bobot yang ada).

**Total gap (totalGapPoints):**

```
totalGapPoints = sum(gap_i untuk semua skill i)
```

Ini bisa negatif (defisit keseluruhan) — tampilkan sebagai informasi tambahan seperti "Total Gap -105" pada contoh esai, bukan sebagai metrik utama (metrik utama untuk pengguna adalah `overallReadinessPercent` dan tabel detail).

## Simpan hasil

Simpan `SkillGapAnalysis` dengan `gapDetails` berbentuk array JSON:

```json
[
  {
    "skillId": "...",
    "skillName": "SQL",
    "weight": 15,
    "userScore": 60,
    "industryScore": 85,
    "gap": -25,
    "gapCategory": "Tinggi",
    "priority": "Sangat Prioritas"
  }
]
```

Juga upsert `UserSkill` untuk tiap skill yang dinilai user (supaya jadi acuan default di analisis berikutnya dan dipakai fitur Career Readiness Score).

## Kondisi khusus

- Kalau role yang dipilih tidak punya `IndustryStandardSkill` sama sekali, tampilkan pesan "Standar kompetensi untuk karier ini belum tersedia" dan jangan lanjut ke perhitungan.
- Skor user harus divalidasi 0–100 di server (Zod), bukan hanya di client.

## Kriteria selesai

- [ ] User bisa memilih career role dan mengisi skor skill dirinya
- [ ] Perhitungan gap per skill dan overall readiness sesuai formula di atas
- [ ] Tabel hasil menampilkan kategori gap dan prioritas dengan benar
- [ ] Hasil tersimpan dan bisa dilihat lagi dari riwayat
