import { GoogleGenAI } from "@google/genai";

// Model Gemini yang digunakan — pakai flash terbaru
const MODEL_NAME = "gemini-2.0-flash";

// ==================== API Key Pool ====================

function getApiKeyPool(): string[] {
  const poolStr = process.env.GEMINI_API_KEY_POOL;
  if (poolStr) {
    // Hapus tanda kutip pembuka & penutup jika ada di seluruh string
    const cleanPool = poolStr.replace(/^["']|["']$/g, "");
    return cleanPool
      .split(",")
      .map((k) => k.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  const singleKey = process.env.GEMINI_API_KEY;
  if (singleKey) {
    return [singleKey.trim().replace(/^["']|["']$/g, "")];
  }
  return [];
}

// Memory pointer untuk algoritma Round Robin
let currentKeyIndex = 0;

function getNextClient(): { client: GoogleGenAI; index: number } {
  const keys = getApiKeyPool();
  if (keys.length === 0) {
    throw new Error(
      "GEMINI_API_KEY atau GEMINI_API_KEY_POOL tidak terkonfigurasi di environment variables."
    );
  }
  const index = currentKeyIndex;
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  console.log(
    `[Gemini Pool] Round Robin: Menggunakan Key #${index} dari total ${keys.length} key.`
  );
  return { client: new GoogleGenAI({ apiKey: keys[index] }), index };
}

// ==================== Helpers ====================

function isRateLimitError(msg: string): boolean {
  return (
    msg.includes("429") ||
    msg.toLowerCase().includes("quota") ||
    msg.toLowerCase().includes("exhausted") ||
    msg.toLowerCase().includes("resource_exhausted")
  );
}

// ==================== Public API ====================

/**
 * Memanggil Gemini API dan mengharapkan respons JSON terstruktur.
 * Menggunakan mimeType: "application/json".
 * Dilengkapi dengan rotasi key otomatis Round Robin jika terjadi rate limit (429).
 */
export async function generateJsonResponse<T>(params: {
  systemInstruction: string;
  userPrompt: string;
}): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const keys = getApiKeyPool();
  const maxRetries = Math.max(2, keys.length);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let keyIndex = -1;
    try {
      const { client, index } = getNextClient();
      keyIndex = index;

      const response = await client.models.generateContent({
        model: MODEL_NAME,
        contents: params.userPrompt,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const text = response.text ?? "";
      const parsed = JSON.parse(text) as T;

      console.log(
        `[Gemini Pool] JSON sukses: Key #${keyIndex}, percobaan ke-${attempt}`
      );
      return { success: true, data: parsed };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[Gemini Pool] Gagal percobaan ke-${attempt} (Key #${keyIndex}): ${msg}`
      );

      if (isRateLimitError(msg) && attempt < maxRetries) {
        console.warn("[Gemini Pool] Rate limit — memutar ke key berikutnya...");
        continue;
      }

      return { success: false, error: `Gemini Error (percobaan ${attempt}): ${msg}` };
    }
  }

  return { success: false, error: "Seluruh API key di pool mengalami rate limit." };
}

/**
 * Memanggil Gemini API untuk respons teks bebas (non-JSON).
 * Dilengkapi dengan rotasi key Round Robin.
 */
export async function generateTextResponse(params: {
  systemInstruction: string;
  userPrompt: string;
}): Promise<{ success: true; data: string } | { success: false; error: string }> {
  const keys = getApiKeyPool();
  const maxRetries = Math.max(2, keys.length);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let keyIndex = -1;
    try {
      const { client, index } = getNextClient();
      keyIndex = index;

      const response = await client.models.generateContent({
        model: MODEL_NAME,
        contents: params.userPrompt,
        config: {
          systemInstruction: params.systemInstruction,
        },
      });

      const text = response.text ?? "";
      console.log(
        `[Gemini Pool] Teks sukses: Key #${keyIndex}, percobaan ke-${attempt}`
      );
      return { success: true, data: text };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[Gemini Pool] Gagal percobaan ke-${attempt} (Key #${keyIndex}): ${msg}`
      );

      if (isRateLimitError(msg) && attempt < maxRetries) {
        console.warn("[Gemini Pool] Rate limit — memutar ke key berikutnya...");
        continue;
      }

      return { success: false, error: `Gemini Error (percobaan ${attempt}): ${msg}` };
    }
  }

  return { success: false, error: "Seluruh API key di pool mengalami rate limit." };
}
