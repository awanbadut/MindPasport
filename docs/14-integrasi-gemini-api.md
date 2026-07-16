# 14 — Integrasi Gemini API

## Package

```bash
npm install @google/generative-ai
```

## Environment variable

```
GEMINI_API_KEY=<diisi oleh user, jangan pernah di-hardcode>
```

## Wrapper terpusat (`src/lib/gemini.ts`)

Semua pemanggilan Gemini API HARUS lewat satu file wrapper ini, jangan panggil SDK Gemini langsung dari route API/komponen manapun. Ini supaya konfigurasi model, error handling, dan parsing JSON konsisten di semua fitur.

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Gunakan model terbaru yang tersedia saat implementasi (cek dokumentasi resmi Google
// untuk nama model stabil terkini, misalnya keluarga "gemini-1.5-flash" atau versi
// lebih baru — JANGAN asal menebak nama model, verifikasi dulu ke docs Gemini API
// karena nama model berubah dari waktu ke waktu).
const MODEL_NAME = "gemini-1.5-flash"; // ganti sesuai model stabil terbaru saat build

export async function generateJsonResponse<T>(params: {
  systemInstruction: string;
  userPrompt: string;
}): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: params.systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(params.userPrompt);
    const text = result.response.text();
    const parsed = JSON.parse(text) as T;
    return { success: true, data: parsed };
  } catch (err) {
    console.error("Gemini API error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
```

Gunakan `responseMimeType: "application/json"` (structured output mode Gemini) supaya hasil selalu berupa JSON valid, mengurangi risiko parsing gagal.

## Pola pemakaian di tiap fitur

Setiap fitur yang butuh AI (06, 08, 12, 13) memanggil `generateJsonResponse()` dengan:
- `systemInstruction` — instruksi peran & format output (spesifik per fitur, contoh di masing-masing file fitur)
- `userPrompt` — konteks data pengguna yang relevan, dirangkum secara ringkas (jangan kirim seluruh raw database, cukup field yang relevan)

## Prinsip anti-halusinasi untuk semua prompt AI di app ini

1. **Selalu batasi pilihan AI ke data yang ada di database.** Contoh: saat minta rekomendasi karier di Career DNA Assessment, sertakan daftar nama `CareerRole` yang ada di database dalam prompt, minta Gemini memilih & mengurutkan dari daftar itu — jangan biarkan Gemini mengarang nama karier baru yang tidak ada standarnya di sistem.
2. **Jangan minta Gemini menghitung skor numerik penting** (Career Readiness Score, Skill Gap percentage, Industry Match percentage) — semua itu HARUS dihitung matematis di `src/lib/scoring.ts`. Gemini hanya untuk teks naratif/insight/rekomendasi kualitatif.
3. **Jangan minta Gemini mengarang URL/link spesifik** ke platform pelatihan/lowongan yang belum tentu benar-benar ada. Biarkan `url` bernilai `null`, cukup beri nama/topik.
4. **Selalu minta output JSON terstruktur** (bukan teks bebas markdown) supaya bisa divalidasi dengan Zod sebelum disimpan ke database. Kalau hasil parse gagal validasi Zod, treat sebagai error (lihat penanganan error di tiap file fitur), jangan dipaksa disimpan.
5. **Retry maksimal 1 kali** kalau JSON tidak valid, dengan menambahkan instruksi lebih tegas ("Kembalikan HANYA JSON valid sesuai skema, tanpa teks tambahan"). Setelah retry gagal, treat sebagai error dan beri tahu user secara jujur.

## Contoh systemInstruction untuk Career DNA insight (referensi pola)

```
Kamu adalah asisten analisis karier. Berdasarkan skor 5 dimensi Career DNA pengguna
dan daftar karier yang tersedia di sistem (diberikan di bawah), hasilkan:
1. 2-3 "top traits" singkat (maksimal 5 kata tiap trait) untuk tiap dimensi yang skornya
   di atas 70.
2. 3-5 rekomendasi karier HANYA dari daftar karier yang diberikan, diurutkan dari
   yang paling cocok, dengan matchPercentage (0-100).

Kembalikan HANYA JSON valid dengan skema:
{
  "topTraits": { "direction": string[], "nature": string[], "ability": string[], "careerFit": string[], "growthPotential": string[] },
  "recommendedCareers": [{ "careerRoleId": string, "title": string, "matchPercentage": number }]
}
Jangan menyertakan teks lain di luar JSON.
```

Pola serupa dipakai untuk fitur 08 (roadmap), 12 (navigator), dan bagian naratif opsional di 13 (industry match) — sesuaikan skema JSON dan isi instruksi sesuai kebutuhan fitur masing-masing, tapi tetap ikuti 5 prinsip anti-halusinasi di atas.

## Penanganan biaya & rate limit

- Cache hasil Career DNA insight (tidak perlu panggil ulang Gemini setiap halaman dibuka, hanya saat submit/retake assessment)
- Untuk AI Career Navigator, batasi user memicu request baru maksimal 1x per menit (lihat `12-fitur-ai-career-navigator.md`)
- Log setiap pemanggilan (sukses/gagal) minimal ke console untuk debugging awal; kalau ada infrastruktur logging (mis. Sentry) boleh dipakai, tapi bukan requirement wajib versi pertama
