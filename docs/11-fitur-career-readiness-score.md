# 11 — Fitur: Career Readiness Score

## Tujuan fitur

Menghasilkan skor 0–100 yang menunjukkan tingkat kesiapan karier pengguna, dihitung dari kombinasi hard skill, soft skill, pengalaman praktis, kepemimpinan, adaptasi, dan konsistensi pengembangan diri.

## Formula resmi (WAJIB PERSIS, JANGAN DIUBAH)

```
CSR = (0.25 × HS) + (0.25 × SS) + (0.20 × PP) + (0.15 × K) + (0.10 × A) + (0.05 × KP)
```

Keterangan:
- `HS` = Hard Skill (0–100)
- `SS` = Soft Skill (0–100)
- `PP` = Pengalaman Praktis (0–100)
- `K` = Kepemimpinan (0–100)
- `A` = Adaptasi (0–100)
- `KP` = Konsistensi Pengembangan (0–100)

Implementasikan sebagai fungsi murni di `src/lib/scoring.ts`:

```ts
export function calculateCareerReadinessScore(input: {
  hardSkill: number;
  softSkill: number;
  practicalExperience: number;
  leadership: number;
  adaptability: number;
  consistency: number;
}): number {
  const { hardSkill, softSkill, practicalExperience, leadership, adaptability, consistency } = input;
  return (
    0.25 * hardSkill +
    0.25 * softSkill +
    0.20 * practicalExperience +
    0.15 * leadership +
    0.10 * adaptability +
    0.05 * consistency
  );
}
```

## Kategori hasil (WAJIB PERSIS)

| Rentang Skor | Kategori | Makna |
|--------------|----------|-------|
| 0–39 | Belum Siap | Pengguna masih membutuhkan pemetaan potensi dan pengembangan kompetensi dasar |
| 40–59 | Berkembang | Pengguna mulai memiliki beberapa kompetensi, tetapi masih perlu penguatan skill dan pengalaman |
| 60–79 | Cukup Siap | Pengguna telah memiliki kompetensi yang cukup, namun masih perlu meningkatkan beberapa aspek karier tertentu |
| 80–100 | Sangat Siap | Pengguna memiliki kompetensi, pengalaman, dan kesiapan karier yang kuat untuk memasuki dunia kerja |

## Cara menghitung tiap komponen (HS, SS, PP, K, A, KP) dari data yang ada

Karena esai tidak merinci sumber data tiap komponen secara teknis, berikut pemetaan resmi yang harus diikuti (fungsi ini juga di `src/lib/scoring.ts`, terpisah dari formula CSR di atas supaya keduanya independen dan mudah diaudit):

**Hard Skill (HS):**
```
HS = rata-rata UserSkill.currentScore untuk semua skill berkategori "Hard Skill" milik user
```
Kalau user belum punya `UserSkill` kategori Hard Skill sama sekali, `HS = 0`.

**Soft Skill (SS):**
```
SS = rata-rata UserSkill.currentScore untuk semua skill berkategori "Soft Skill" milik user
```
Sama seperti HS, default `0` kalau kosong.

**Pengalaman Praktis (PP):**
Dihitung dari jumlah `ProgressEntry` bertipe `internship`, `project`, `competition`, `volunteer`:
```
PP = min(100, jumlahEntriPengalamanPraktis × 10)
```
(setiap entri pengalaman praktis bernilai 10 poin, cap di 100 — artinya 10 entri atau lebih = skor penuh)
Entri yang `verified: true` dihitung penuh (10 poin), entri yang belum diverifikasi dihitung setengah (5 poin), supaya ada insentif verifikasi tapi tidak menghukum user yang jujur mengisi data mentah.

**Kepemimpinan (K):**
Dihitung dari jumlah `ProgressEntry` bertipe `organization` DAN dari soft skill spesifik "Kepemimpinan"/"Leadership" di `UserSkill` kalau ada:
```
K = round( (jumlahEntriOrganisasi × 15, dicap 100) × 0.5 + (skorUserSkillLeadership atau 0) × 0.5 )
```
Kalau skill "Kepemimpinan"/"Leadership" tidak ada di `UserSkill` user, gunakan hanya komponen dari jumlah entri organisasi (bobot 100% ke situ).

**Adaptasi (A):**
Diambil langsung dari `CareerDNA.growthPotentialScore` (dimensi Growth Potential sudah merepresentasikan adaptasi & respons terhadap perubahan):
```
A = CareerDNA.growthPotentialScore (atau 0 kalau belum isi Career DNA)
```

**Konsistensi Pengembangan (KP):**
Dihitung dari rasio penyelesaian item roadmap yang sudah lewat target/aktif:
```
KP = round( (jumlah RoadmapItem berstatus "done" / total RoadmapItem semua roadmap aktif) × 100 )
```
Kalau user belum punya roadmap sama sekali, `KP = 0`.

## Alur perhitungan

1. User (atau sistem secara terjadwal — untuk versi awal cukup tombol manual "Hitung Ulang Skor") memicu `POST /api/readiness-score/calculate`
2. Server ambil semua data yang dibutuhkan (UserSkill, ProgressEntry, CareerDNA, RoadmapItem)
3. Hitung HS, SS, PP, K, A, KP sesuai rumus di atas
4. Hitung `finalScore` dengan formula CSR
5. Tentukan `category` dari rentang skor
6. Simpan sebagai entri baru di `ReadinessScoreHistory` (jangan overwrite yang lama — ini riwayat, dipakai untuk grafik tren)
7. Tampilkan hasil terbaru + grafik garis riwayat skor dari waktu ke waktu (pakai `chart_display` pattern / Recharts line chart)

## Kondisi khusus

- Semua komponen (HS, SS, PP, K, A, KP) harus di-clamp ke rentang 0–100 sebelum masuk formula CSR, untuk mencegah nilai di luar rentang akibat bug perhitungan.
- `finalScore` disimpan sebagai `Float`, tapi ditampilkan ke user dibulatkan ke bilangan bulat terdekat.

## Kriteria selesai

- [ ] Formula CSR diimplementasikan persis seperti di atas, sebagai pure function yang bisa di-unit-test
- [ ] Semua 6 komponen dihitung sesuai pemetaan data resmi di atas
- [ ] Kategori skor sesuai tabel rentang di atas
- [ ] Riwayat skor tersimpan dan bisa ditampilkan sebagai grafik tren
