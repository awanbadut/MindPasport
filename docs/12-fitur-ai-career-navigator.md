# 12 — Fitur: AI Career Navigator

## Tujuan fitur

Memberi rekomendasi berbasis AI (pelatihan, peluang magang, proyek, jalur karier) yang sesuai dengan profil lengkap pengguna — ini adalah fitur yang paling "mengambil keputusan otonom" dibanding fitur lain, jadi harus benar-benar memanggil Gemini API dengan konteks yang kaya, bukan template statis.

## Model data terkait

`AiNavigatorLog` — menyimpan riwayat rekomendasi yang pernah diberikan.

## Konteks yang dikirim ke Gemini

Kumpulkan dan rangkum data berikut sebelum membangun prompt (lihat `14-integrasi-gemini-api.md` untuk detail teknis pemanggilan API):

- Career DNA: skor 5 dimensi + top traits
- Career role tujuan (kalau sudah dipilih di Skill Gap Analysis manapun yang paling baru)
- Ringkasan Skill Gap Analysis terakhir: skill dengan prioritas "Sangat Prioritas" dan "Prioritas"
- Status roadmap saat ini: berapa item selesai, berapa yang belum
- Career Readiness Score terbaru dan kategorinya
- Ringkasan `ProgressEntry` beberapa bulan terakhir (jenis aktivitas apa yang paling sering/jarang dilakukan)

## Format output yang diminta dari Gemini

Minta Gemini mengembalikan JSON terstruktur (bukan teks bebas), dengan skema:

```json
{
  "recommendations": [
    {
      "type": "training",
      "title": "Kursus SQL untuk Data Analyst Pemula",
      "reason": "Skill SQL kamu masih 25 poin di bawah standar industri untuk role Data Analyst, dan ini prioritas tertinggi di roadmap kamu saat ini.",
      "url": null
    },
    {
      "type": "internship",
      "title": "Program magang Data & Analytics",
      "reason": "...",
      "url": null
    }
  ]
}
```

`type` salah satu dari: `"training"`, `"internship"`, `"project"`, `"career-path"`. `url` boleh `null` — jangan minta Gemini mengarang URL spesifik ke platform pelatihan yang belum tentu benar-benar ada (risiko halusinasi tinggi); cukup nama/topik rekomendasi dan alasannya.

Minta 4–6 rekomendasi per panggilan, campuran dari beberapa `type`.

## Alur pengguna

1. User klik "Minta Rekomendasi Baru" di halaman AI Career Navigator
2. Server rangkum konteks (lihat di atas), kirim ke Gemini, parse response JSON
3. Simpan sebagai `AiNavigatorLog` baru (jangan overwrite riwayat lama — user boleh lihat rekomendasi-rekomendasi sebelumnya)
4. Tampilkan sebagai kartu-kartu rekomendasi, dikelompokkan per `type`, tiap kartu tampilkan alasan (`reason`)

## Kondisi khusus

- Kalau Gemini mengembalikan JSON yang tidak valid/tidak sesuai skema, coba parse ulang dengan instruksi lebih ketat sekali (retry maksimal 1x), kalau tetap gagal tampilkan pesan error yang jelas ke user ("Gagal mendapat rekomendasi, coba lagi") — JANGAN tampilkan data dummy yang berpura-pura dari AI.
- Rate-limit fitur ini di level aplikasi (misal maksimal 1 request per menit per user) untuk menghindari pemborosan kuota API akibat klik berulang.
- Jangan expose raw prompt lengkap ke frontend/response API — cukup hasil rekomendasi yang sudah diparse.

## Kriteria selesai

- [ ] Rekomendasi benar-benar dihasilkan dari panggilan Gemini API real-time, bukan data statis
- [ ] Konteks yang dikirim mencakup data lintas fitur (DNA, gap, roadmap, readiness score, progress)
- [ ] Ada penanganan error yang jujur (tidak berpura-pura sukses)
- [ ] Riwayat rekomendasi tersimpan dan bisa dilihat kembali
