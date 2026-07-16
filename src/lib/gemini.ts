import { GoogleGenAI } from "@google/genai";

// Daftar model Gemini yang digunakan secara berurutan sebagai Fallback/Failover
// Jika model pertama habis kuota, otomatis beralih ke model kedua, dan seterusnya.
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

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
    msg.toLowerCase().includes("resource_exhausted") ||
    msg.toLowerCase().includes("limit")
  );
}

// ==================== Public API ====================

/**
 * Memanggil Gemini API dan mengharapkan respons JSON terstruktur.
 * Menggunakan mimeType: "application/json".
 * Dilengkapi dengan rotasi key otomatis Round Robin dan Fallback Model (Flash -> Flash Lite -> 1.5 Flash).
 */
export async function generateJsonResponse<T>(params: {
  systemInstruction: string;
  userPrompt: string;
}): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const keys = getApiKeyPool();

  // Iterasi melalui daftar model fallback
  for (const model of FALLBACK_MODELS) {
    console.log(`[Gemini Pool] Mencoba memproses JSON dengan model: ${model}`);
    const maxRetries = Math.max(2, keys.length);
    let success = false;
    let lastError = "";

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      let keyIndex = -1;
      try {
        const { client, index } = getNextClient();
        keyIndex = index;

        const response = await client.models.generateContent({
          model: model,
          contents: params.userPrompt,
          config: {
            systemInstruction: params.systemInstruction,
            responseMimeType: "application/json",
          },
        });

        const text = response.text ?? "";
        const parsed = JSON.parse(text) as T;

        console.log(
          `[Gemini Pool] JSON sukses dengan model ${model} menggunakan Key #${keyIndex}, percobaan ke-${attempt}`
        );
        return { success: true, data: parsed };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        lastError = msg;
        console.warn(
          `[Gemini Pool] Gagal dengan model ${model} pada percobaan ke-${attempt} (Key #${keyIndex}): ${msg}`
        );

        if (isRateLimitError(msg) && attempt < maxRetries) {
          console.warn("[Gemini Pool] Rate limit — memutar ke key berikutnya...");
          continue;
        }
      }
    }

    console.warn(
      `[Gemini Pool] Model ${model} gagal untuk seluruh key di pool. Beralih ke model berikutnya...`
    );
  }

  return {
    success: false,
    error: "Seluruh model fallback (Gemini 2.5 Flash, Lite, 1.5 Flash) dan seluruh API key di pool mengalami rate limit/quota exhausted.",
  };
}

/**
 * Memanggil Gemini API untuk respons teks bebas (non-JSON).
 * Dilengkapi dengan rotasi key Round Robin dan Fallback Model.
 */
export async function generateTextResponse(params: {
  systemInstruction: string;
  userPrompt: string;
}): Promise<{ success: true; data: string } | { success: false; error: string }> {
  const keys = getApiKeyPool();

  // Iterasi melalui daftar model fallback
  for (const model of FALLBACK_MODELS) {
    console.log(`[Gemini Pool] Mencoba memproses TEKS dengan model: ${model}`);
    const maxRetries = Math.max(2, keys.length);
    let success = false;
    let lastError = "";

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      let keyIndex = -1;
      try {
        const { client, index } = getNextClient();
        keyIndex = index;

        const response = await client.models.generateContent({
          model: model,
          contents: params.userPrompt,
          config: {
            systemInstruction: params.systemInstruction,
          },
        });

        const text = response.text ?? "";
        console.log(
          `[Gemini Pool] Teks sukses dengan model ${model} menggunakan Key #${keyIndex}, percobaan ke-${attempt}`
        );
        return { success: true, data: text };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        lastError = msg;
        console.warn(
          `[Gemini Pool] Gagal dengan model ${model} pada percobaan ke-${attempt} (Key #${keyIndex}): ${msg}`
        );

        if (isRateLimitError(msg) && attempt < maxRetries) {
          console.warn("[Gemini Pool] Rate limit — memutar ke key berikutnya...");
          continue;
        }
      }
    }

    console.warn(
      `[Gemini Pool] Model ${model} gagal untuk seluruh key di pool. Beralih ke model berikutnya...`
    );
  }

  return {
    success: false,
    error: "Seluruh model fallback (Gemini 2.5 Flash, Lite, 1.5 Flash) dan seluruh API key di pool mengalami rate limit/quota exhausted.",
  };
}
