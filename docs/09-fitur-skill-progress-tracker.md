# 09 — Fitur: Skill Progress Tracker

## Tujuan fitur

Mencatat dan memantau perkembangan kompetensi pengguna dari berbagai aktivitas: pelatihan, organisasi, magang, proyek, kompetisi, dan kegiatan sukarela — jadi rekam jejak yang jadi bahan Digital Competency Passport dan Career Readiness Score.

## Model data terkait

`ProgressEntry` di `03-database-schema.md`.

## 7 komponen yang dipantau (dari esai, Lampiran 5)

| Komponen | Indikator | Bobot | Dipakai untuk |
|----------|-----------|-------|----------------|
| Penyelesaian Pelatihan | Jumlah kursus/webinar/bootcamp/sertifikasi selesai | 20% | Hard Skill score |
| Penguasaan Hard Skill | Peningkatan kemampuan teknis dari asesmen & proyek | 25% | Hard Skill score |
| Pengembangan Soft Skill | Komunikasi, kepemimpinan, kerja sama, adaptasi, problem solving | 20% | Soft Skill score |
| Pengalaman Praktis | Magang, proyek, kompetisi, freelance, penelitian, volunteer | 15% | Practical Experience score |
| Konsistensi Belajar | Frekuensi & durasi belajar, penyelesaian roadmap | 10% | Consistency score |
| Pencapaian Kompetensi | Badge, sertifikat, penghargaan, lisensi | 5% | Practical Experience / dokumentasi |
| Evaluasi Berkala | Hasil asesmen ulang | 5% | Growth Potential / adaptasi |

Bobot-bobot ini dipakai secara internal untuk menghitung komponen-komponen Career Readiness Score (lihat `11-fitur-career-readiness-score.md`), BUKAN ditampilkan sebagai skor terpisah ke user di halaman ini. Halaman ini fokus ke pencatatan mentah aktivitas.

## Tipe entri (`ProgressEntry.type`)

`training` (pelatihan/kursus/webinar/sertifikasi), `organization` (organisasi), `internship` (magang), `project` (proyek), `competition` (kompetisi), `volunteer` (kegiatan sukarela), `certificate` (sertifikat berdiri sendiri, tidak terkait pelatihan tertentu).

## Alur pengguna

1. User klik "Tambah Aktivitas", isi form: tipe, judul, penyelenggara, deskripsi, tanggal mulai/selesai, upload/link sertifikat (opsional), pilih skill yang terdampak (opsional, multi-select dari master `Skill`)
2. Simpan sebagai `ProgressEntry`
3. Tampilkan sebagai timeline/list, bisa difilter per tipe, diurutkan dari terbaru
4. Setiap entri dengan `relatedSkillIds` terisi, secara otomatis menaikkan sedikit `UserSkill.currentScore` untuk skill terkait (opsional peningkatan kecil, misal +2 sampai +5 poin per aktivitas relevan, dengan cap maksimal 100) — supaya progres tidak harus selalu diinput manual ulang di Skill Gap Analysis. Tulis logika ini di `src/lib/scoring.ts` sebagai fungsi `applyProgressToSkills()`.

## Verifikasi (`verified` field)

Untuk versi pertama, `verified` boleh diset manual oleh Admin lewat panel admin sederhana (endpoint `PATCH /api/admin/progress/[id]/verify` — tambahkan endpoint ini di implementasi meski tidak eksplisit tercantum di `05-api-contract-overview.md`, karena ini bagian natural dari fitur verifikasi). Entri yang belum diverifikasi tetap tampil ke user (dengan badge "Belum Diverifikasi"), tapi beri bobot lebih kecil di perhitungan Career Readiness Score dibanding entri yang sudah diverifikasi (lihat `11-fitur-career-readiness-score.md` untuk detail bobot).

## Kondisi khusus

- Tanggal selesai (`endDate`) boleh kosong untuk aktivitas yang sedang berlangsung.
- Hapus entri (`DELETE /api/progress/[id]`) harus mengecek kepemilikan (`userId` sesuai session).

## Kriteria selesai

- [ ] User bisa tambah, edit, hapus entri aktivitas
- [ ] Entri bisa difilter per tipe
- [ ] Entri dengan skill terkait mempengaruhi `UserSkill.currentScore` secara wajar dan ter-cap di 100
- [ ] Ada mekanisme verifikasi dasar oleh admin
