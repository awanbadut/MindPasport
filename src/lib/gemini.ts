import { GoogleGenerativeAI } from "@google/generative-ai";

// Wrapper terpusat untuk semua panggilan Gemini API.
// Semua fitur AI WAJIB memanggil fungsi ini, JANGAN panggil SDK langsung dari route/komponen.
// Ikuti 5 prinsip anti-halusinasi di 14-integrasi-gemini-api.md.

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Menggunakan gemini-1.5-flash sebagai model stabil.
// Cek dokumentasi resmi Gemini API untuk nama model terbaru jika diperlukan update.
const MODEL_NAME = "gemini-1.5-flash";

/**
 * Memanggil Gemini API dan mengharapkan respons JSON terstruktur.
 * Menggunakan responseMimeType: "application/json" untuk memastikan output selalu JSON valid.
 * Retry maksimal 1x kalau JSON tidak valid (sesuai prinsip #5 anti-halusinasi).
 */
export async function generateJsonResponse<T>(params: {
  systemInstruction: string;
  userPrompt: string;
}): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const callGemini = async (extraInstruction?: string) => {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: extraInstruction
        ? `${params.systemInstruction}\n\n${extraInstruction}`
        : params.systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(params.userPrompt);
    const text = result.response.text();
    return JSON.parse(text) as T;
  };

  try {
    const data = await callGemini();
    console.log("[Gemini] Request sukses");
    return { success: true, data };
  } catch (firstErr) {
    console.warn("[Gemini] Percobaan pertama gagal, mencoba retry:", firstErr);
    // Retry 1x dengan instruksi lebih ketat (prinsip #5)
    try {
      const data = await callGemini(
        "PENTING: Kembalikan HANYA JSON valid sesuai skema yang diminta, tanpa teks tambahan apapun di luar JSON."
      );
      console.log("[Gemini] Retry sukses");
      return { success: true, data };
    } catch (retryErr) {
      const errorMsg = retryErr instanceof Error ? retryErr.message : "Unknown Gemini error";
      console.error("[Gemini] Retry gagal:", retryErr);
      return { success: false, error: errorMsg };
    }
  }
}

/**
 * Helper untuk generate teks bebas (non-JSON) dari Gemini.
 * Dipakai untuk narasi singkat (misalnya Industry Match summary).
 */
export async function generateTextResponse(params: {
  systemInstruction: string;
  userPrompt: string;
}): Promise<{ success: true; data: string } | { success: false; error: string }> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: params.systemInstruction,
    });

    const result = await model.generateContent(params.userPrompt);
    const text = result.response.text();
    return { success: true, data: text };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown Gemini error";
    console.error("[Gemini] generateTextResponse error:", err);
    return { success: false, error: errorMsg };
  }
}
