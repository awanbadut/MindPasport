import { GoogleGenerativeAI } from "@google/generative-ai";

// Model stabil Gemini API
const MODEL_NAME = "gemini-1.5-flash";

// Inisialisasi API key pool dari environment variables
function getApiKeyPool(): string[] {
  const poolStr = process.env.GEMINI_API_KEY_POOL;
  if (poolStr) {
    // Bersihkan spasi dan pisahkan berdasarkan koma
    return poolStr.split(",").map((k) => k.trim()).filter(Boolean);
  }
  // Fallback ke key tunggal jika pool kosong
  const singleKey = process.env.GEMINI_API_KEY;
  return singleKey ? [singleKey.trim()] : [];
}

// Memory pointer untuk algoritma Round Robin (bertahan selama server instance warm/aktif)
let currentKeyIndex = 0;

/**
 * Mendapatkan client GoogleGenerativeAI berikutnya berdasarkan urutan Round Robin.
 * Mengembalikan client beserta index key yang digunakan untuk keperluan logging.
 */
function getNextGenAiClient(): { client: GoogleGenerativeAI; index: number } {
  const keys = getApiKeyPool();
  if (keys.length === 0) {
    throw new Error("GEMINI_API_KEY atau GEMINI_API_KEY_POOL tidak terkonfigurasi di environment variables.");
  }

  // Ambil key sesuai index saat ini
  const index = currentKeyIndex;
  const selectedKey = keys[index];

  // Geser index ke key berikutnya (Round Robin rotation)
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;

  console.log(`[Gemini Pool] Round Robin: Menggunakan Key Index #${index} dari total ${keys.length} key.`);
  return {
    client: new GoogleGenerativeAI(selectedKey),
    index,
  };
}

/**
 * Memanggil Gemini API dan mengharapkan respons JSON terstruktur.
 * Menggunakan mode responseMimeType: "application/json".
 * Dilengkapi dengan rotasi key otomatis (Round Robin) jika terjadi error Quota/Rate Limit (429).
 */
export async function generateJsonResponse<T>(params: {
  systemInstruction: string;
  userPrompt: string;
}): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const keysCount = getApiKeyPool().length;
  // Coba rotasi key sebanyak jumlah key yang tersedia di pool
  const maxRetries = Math.max(2, keysCount);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let keyIndexUsed = -1;
    try {
      const { client, index } = getNextGenAiClient();
      keyIndexUsed = index;

      const model = client.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: params.systemInstruction,
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(params.userPrompt);
      const text = result.response.text();
      const parsedData = JSON.parse(text) as T;

      console.log(`[Gemini Pool] Request JSON sukses menggunakan Key Index #${keyIndexUsed} pada percobaan ke-${attempt}.`);
      return { success: true, data: parsedData };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[Gemini Pool] Gagal pada percobaan ke-${attempt} (Key Index #${keyIndexUsed}):`,
        errorMsg
      );

      // Cek apakah error disebabkan rate limit atau quota habis (HTTP 429 atau kata kunci Quota/Limit)
      const isRateLimit =
        errorMsg.includes("429") ||
        errorMsg.toLowerCase().includes("quota") ||
        errorMsg.toLowerCase().includes("limit") ||
        errorMsg.toLowerCase().includes("exhausted");

      if (isRateLimit && attempt < maxRetries) {
        console.warn("[Gemini Pool] Mendeteksi rate limit / quota habis. Memutar ke key berikutnya...");
        // Loop berlanjut ke percobaan berikutnya dengan key yang berbeda
        continue;
      }

      // Jika bukan rate limit atau sudah mencapai batas maksimal percobaan, kembalikan error
      return { success: false, error: `Gemini Error (Attempt ${attempt}): ${errorMsg}` };
    }
  }

  return { success: false, error: "Seluruh API key di pool mengalami rate limit." };
}

/**
 * Helper untuk generate teks bebas (non-JSON) dengan rotasi API Key Round Robin.
 */
export async function generateTextResponse(params: {
  systemInstruction: string;
  userPrompt: string;
}): Promise<{ success: true; data: string } | { success: false; error: string }> {
  const keysCount = getApiKeyPool().length;
  const maxRetries = Math.max(2, keysCount);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let keyIndexUsed = -1;
    try {
      const { client, index } = getNextGenAiClient();
      keyIndexUsed = index;

      const model = client.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: params.systemInstruction,
      });

      const result = await model.generateContent(params.userPrompt);
      const text = result.response.text();

      console.log(`[Gemini Pool] Request Teks sukses menggunakan Key Index #${keyIndexUsed} pada percobaan ke-${attempt}.`);
      return { success: true, data: text };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[Gemini Pool] Gagal pada percobaan ke-${attempt} (Key Index #${keyIndexUsed}):`,
        errorMsg
      );

      const isRateLimit =
        errorMsg.includes("429") ||
        errorMsg.toLowerCase().includes("quota") ||
        errorMsg.toLowerCase().includes("limit") ||
        errorMsg.toLowerCase().includes("exhausted");

      if (isRateLimit && attempt < maxRetries) {
        console.warn("[Gemini Pool] Mendeteksi rate limit / quota habis. Memutar ke key berikutnya...");
        continue;
      }

      return { success: false, error: `Gemini Error (Attempt ${attempt}): ${errorMsg}` };
    }
  }

  return { success: false, error: "Seluruh API key di pool mengalami rate limit." };
}
