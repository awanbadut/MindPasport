# 05 — API Contract Overview

## Konvensi umum

- Semua endpoint di bawah `/api/*`, format JSON.
- Response sukses: `{ success: true, data: <payload> }`
- Response gagal: `{ success: false, error: { code: string, message: string } }`
- Kode HTTP dipakai konsisten: `200` sukses baca, `201` sukses buat, `400` validasi gagal, `401` belum login, `403` tidak punya akses ke resource ini, `404` tidak ditemukan, `500` error server.
- Semua endpoint (kecuali yang ditandai publik) wajib session valid dan hanya mengoperasikan data milik `userId` dari session tersebut.

## Daftar endpoint per fitur

### Auth
| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/[...nextauth]` | Ditangani NextAuth (login/logout/session) |

### 1. Career DNA Assessment
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/career-dna` | Ambil hasil Career DNA milik user login (404 kalau belum pernah isi) |
| POST | `/api/career-dna` | Submit jawaban kuesioner, hitung skor 5 dimensi, panggil Gemini untuk insight & rekomendasi karier, simpan hasil |
| PUT | `/api/career-dna` | Isi ulang asesmen (retake), update hasil |

### 2. Skill Gap Analysis
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/career-roles` | Daftar semua `CareerRole` (untuk dropdown pilih karier tujuan) |
| POST | `/api/skill-gap` | Body: `{ careerRoleId, userSkillScores: [{skillId, score}] }` → hitung gap, simpan `SkillGapAnalysis`, return detail |
| GET | `/api/skill-gap` | Riwayat semua analisis gap milik user |
| GET | `/api/skill-gap/[id]` | Detail satu hasil analisis |

### 3. Personalized Skill Roadmap
| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/roadmap` | Body: `{ skillGapAnalysisId }` → generate roadmap (pakai Gemini untuk urutan & rekomendasi aktivitas), simpan `SkillRoadmap` + `RoadmapItem[]` |
| GET | `/api/roadmap` | Daftar roadmap milik user |
| GET | `/api/roadmap/[id]` | Detail satu roadmap beserta item-nya |
| PATCH | `/api/roadmap/item/[id]` | Update status item roadmap (`todo`/`in-progress`/`done`) |

### 4. Skill Progress Tracker
| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/progress` | Tambah entri aktivitas baru |
| GET | `/api/progress` | Daftar entri progress milik user (support query filter `type`, sort by date) |
| PATCH | `/api/progress/[id]` | Edit entri |
| DELETE | `/api/progress/[id]` | Hapus entri |

### 5. Digital Competency Passport
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/passport` | Ambil/generate (kalau belum ada) passport milik user login, termasuk agregasi data dari fitur lain |
| PATCH | `/api/passport` | Update visibilitas (`isPublic`) atau regenerasi `publicSlug` |
| GET | `/api/passport/qrcode` | Generate QR code (base64 PNG) dari URL publik passport |
| GET | `/api/passport/public/[slug]` | **Publik, tanpa login.** Versi terbatas data passport untuk dibagikan |

### 6. Career Readiness Score
| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/readiness-score/calculate` | Hitung ulang skor berdasarkan data terbaru (progress, skill gap, dst), simpan entri baru di `ReadinessScoreHistory` |
| GET | `/api/readiness-score` | Riwayat skor (untuk grafik perkembangan dari waktu ke waktu) |
| GET | `/api/readiness-score/latest` | Skor terbaru saja |

### 7. AI Career Navigator
| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/navigator` | Minta rekomendasi baru dari Gemini berdasarkan profil lengkap user, simpan log, return rekomendasi |
| GET | `/api/navigator` | Riwayat rekomendasi yang pernah diberikan |

### 8. Industry Match Recommendation
| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/industry-match` | Body: `{ careerRoleId? }` (kalau kosong, cocokkan ke semua role aktif) → hitung persentase kecocokan |
| GET | `/api/industry-match` | Riwayat hasil pencocokan |

### Admin (master data)
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET/POST | `/api/admin/skills` | Kelola master `Skill` |
| GET/POST | `/api/admin/career-roles` | Kelola master `CareerRole` |
| GET/POST | `/api/admin/industry-standards` | Kelola `IndustryStandardSkill` (bobot & skor standar per role) |

Semua endpoint `/api/admin/*` wajib cek `session.user.role === "ADMIN"`, kembalikan `403` kalau bukan.

## Validasi (Zod)

Setiap endpoint punya schema Zod sendiri di `src/lib/validation/<domain>.ts`. Contoh untuk Skill Gap:

```ts
export const skillGapRequestSchema = z.object({
  careerRoleId: z.string().cuid(),
  userSkillScores: z.array(z.object({
    skillId: z.string().cuid(),
    score: z.number().int().min(0).max(100),
  })).min(1),
});
```

Ikuti pola yang sama untuk domain lain — nama file: `career-dna.ts`, `skill-gap.ts`, `roadmap.ts`, `progress.ts`, `passport.ts`, `readiness-score.ts`, `navigator.ts`, `industry-match.ts`.
