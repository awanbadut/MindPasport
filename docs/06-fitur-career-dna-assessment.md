# 06 — Fitur: Career DNA Assessment

## Tujuan fitur

Memetakan arah karier, karakter diri, dan kemampuan utama pengguna lewat kuesioner, menghasilkan profil 5 dimensi (Career DNA) yang jadi fondasi untuk semua fitur lain.

## 5 Dimensi yang diukur

| Dimensi | Yang diukur | Contoh indikator pertanyaan |
|---------|-------------|------------------------------|
| **Direction** | Arah minat dan tujuan karier | Minat bidang kerja, tujuan karier, preferensi profesi, motivasi pengembangan diri, orientasi masa depan |
| **Nature** | Karakter diri dan kecenderungan perilaku | Kepribadian, nilai kerja, gaya belajar, cara mengambil keputusan, kemampuan kerja sama, respons terhadap tantangan |
| **Ability** | Kemampuan, bakat, dan kompetensi | Hard skill, soft skill, kemampuan akademik, pengalaman organisasi/proyek/pelatihan/magang |
| **Career Fit** | Kesesuaian potensi diri dengan pilihan karier | Kecocokan minat, karakter, nilai kerja, kemampuan dengan bidang karier tertentu |
| **Growth Potential** | Potensi pengembangan diri | Konsistensi belajar, kemampuan adaptasi, kemauan meningkatkan skill, respons terhadap umpan balik |

Tiap dimensi menghasilkan skor 0–100.

## Model data terkait

`CareerDNA` di `03-database-schema.md`: `directionScore`, `natureScore`, `abilityScore`, `careerFitScore`, `growthPotentialScore`, `rawAnswers`, `topTraits`, `recommendedCareers`.

## Struktur kuesioner

Buat kuesioner dengan minimal **25–30 pertanyaan**, terbagi rata ke 5 dimensi (5–6 pertanyaan per dimensi). Format pertanyaan:

- Skala Likert 1–5 (Sangat Tidak Setuju → Sangat Setuju) untuk pertanyaan kepribadian/nilai kerja
- Pilihan ganda untuk minat bidang kerja (mis. pilih 3 dari 10 bidang yang paling diminati)
- Ranking/prioritas untuk nilai kerja (mis. urutkan work values: stabilitas, kreativitas, dampak sosial, penghasilan, dst)

Simpan seluruh jawaban mentah di `rawAnswers` (JSON), supaya bisa dihitung ulang atau diaudit nanti.

Contoh struktur satu pertanyaan (dipakai di frontend & payload API):

```json
{
  "id": "q_direction_01",
  "dimension": "direction",
  "type": "likert",
  "text": "Saya senang mengeksplorasi bidang pekerjaan baru yang belum saya kenal",
  "value": 4
}
```

## Alur pengguna

1. User baru diarahkan otomatis ke halaman ini setelah registrasi
2. Isi kuesioner (bisa multi-step/wizard, per dimensi satu halaman, biar tidak berat)
3. Submit → server hitung skor tiap dimensi (rata-rata terbobot dari jawaban di dimensi tsb, dinormalisasi ke skala 0–100)
4. Server kirim ringkasan jawaban ke Gemini API untuk menghasilkan:
   - `topTraits`: 2–3 insight singkat per dimensi (contoh format di Lampiran prototype esai: "Teknologi & Komputer", "Analisis Data", "Visual & Kreativitas" sebagai top traits Ability)
   - `recommendedCareers`: 3–5 rekomendasi karier dengan `matchPercentage`, diambil dari daftar `CareerRole` yang ada di database (Gemini diberi daftar role yang tersedia, diminta memilih & mengurutkan berdasarkan kecocokan, bukan mengarang role baru)
5. Simpan hasil ke `CareerDNA`, redirect ke halaman hasil
6. Halaman hasil menampilkan radar chart 5 dimensi + kartu top traits per dimensi + daftar rekomendasi karier (mirip Lampiran 1 esai: "Career DNA Assessment")

## Perhitungan skor dimensi (sebelum dikirim ke AI)

Untuk tiap dimensi:

```
skorDimensi = round( (sum(nilai_jawaban_di_dimensi_ini) / (jumlah_pertanyaan * skala_maksimal)) * 100 )
```

Contoh: 6 pertanyaan Likert 1–5 di dimensi Direction, total jawaban = 25 → `skorDimensi = round((25/30)*100) = 83`.

Ini murni matematis, TIDAK butuh AI. AI hanya dipakai untuk menghasilkan **insight tekstual** (`topTraits`) dan **rekomendasi karier** (`recommendedCareers`), bukan untuk menghitung skor numerik dimensi.

## Retake assessment

User boleh mengisi ulang asesmen (`PUT /api/career-dna`). Simpan sebagai update pada baris yang sama (bukan riwayat historis) — cukup satu `CareerDNA` aktif per user, karena `userId` bersifat `@unique` di skema.

## Kondisi khusus

- Kalau panggilan Gemini API gagal, tetap simpan skor numerik dimensi (yang murni matematis), tapi `topTraits`/`recommendedCareers` diisi array kosong dan tampilkan pesan "Insight AI belum tersedia, coba lagi nanti" di UI, jangan gagalkan seluruh proses submit.
- Wajib validasi semua dimensi sudah terisi (tidak boleh submit parsial).

## Kriteria selesai

- [ ] Kuesioner 5 dimensi bisa diisi dan disubmit
- [ ] Skor tiap dimensi terhitung benar secara matematis
- [ ] Insight & rekomendasi karier dari Gemini tersimpan dan tampil
- [ ] Radar chart menampilkan 5 skor dimensi
- [ ] Retake assessment berfungsi tanpa duplikasi data
