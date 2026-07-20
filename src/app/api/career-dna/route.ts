import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { submitCareerDnaSchema } from "@/lib/validation/career-dna";
import { calculateDimensionScore } from "@/lib/scoring";
import { generateJsonResponse } from "@/lib/gemini";
import type { CareerDnaGeminiResponse, RawAnswer, TopTraits } from "@/types";

// ==================== GET /api/career-dna ====================
// Ambil hasil Career DNA milik user login (404 kalau belum pernah isi)

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const careerDNA = await prisma.careerDNA.findUnique({
      where: { userId: session.user.id },
    });

    if (!careerDNA) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Career DNA belum diisi" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: careerDNA });
  } catch (err) {
    console.error("[GET /api/career-dna] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// ==================== POST /api/career-dna ====================
// Submit jawaban kuesioner, hitung skor 5 dimensi, panggil Gemini

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = submitCareerDnaSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parseResult.error.issues[0]?.message ?? "Data tidak valid",
          },
        },
        { status: 400 }
      );
    }

    const { answers } = parseResult.data;

    return await processCareerDna(session.user.id, answers as RawAnswer[]);
  } catch (err) {
    console.error("[POST /api/career-dna] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// ==================== PUT /api/career-dna ====================
// Isi ulang asesmen (retake) — update hasil yang ada

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = submitCareerDnaSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parseResult.error.issues[0]?.message ?? "Data tidak valid",
          },
        },
        { status: 400 }
      );
    }

    const { answers } = parseResult.data;
    return await processCareerDna(session.user.id, answers as RawAnswer[], true);
  } catch (err) {
    console.error("[PUT /api/career-dna] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// ==================== Shared Logic ====================

async function processCareerDna(userId: string, answers: RawAnswer[], isRetake = false) {
  // 1. Kelompokkan jawaban per dimensi
  const dimensionAnswers = {
    direction: answers.filter(a => a.dimension === "direction").map(a => a.value),
    nature: answers.filter(a => a.dimension === "nature").map(a => a.value),
    ability: answers.filter(a => a.dimension === "ability").map(a => a.value),
    careerFit: answers.filter(a => a.dimension === "careerFit").map(a => a.value),
    growthPotential: answers.filter(a => a.dimension === "growthPotential").map(a => a.value),
  };

  // 2. Hitung skor tiap dimensi secara MATEMATIS (bukan AI)
  // Formula: round((sum(values) / (count * maxScale)) * 100)
  const directionScore = calculateDimensionScore(dimensionAnswers.direction, 5);
  const natureScore = calculateDimensionScore(dimensionAnswers.nature, 5);
  const abilityScore = calculateDimensionScore(dimensionAnswers.ability, 5);
  const careerFitScore = calculateDimensionScore(dimensionAnswers.careerFit, 5);
  const growthPotentialScore = calculateDimensionScore(dimensionAnswers.growthPotential, 5);

  // 3. Ambil daftar CareerRole yang ada untuk dikirim ke Gemini (anti-halusinasi: pilih dari data real)
  const careerRoles = await prisma.careerRole.findMany({
    select: { id: true, title: true, category: true },
  });

  // 4. Panggil Gemini untuk insight tekstual dan rekomendasi karier
  // Sesuai prinsip anti-halusinasi: berikan daftar role yang tersedia, jangan biarkan AI mengarang
  const geminiResult = await generateJsonResponse<CareerDnaGeminiResponse>({
    systemInstruction: `Kamu adalah asisten analisis karier untuk aplikasi Mind Passport. 
Berdasarkan skor 5 dimensi Career DNA pengguna dan daftar karier yang tersedia di sistem (diberikan di bawah), hasilkan:
1. 2-3 "top traits" singkat (maksimal 5 kata tiap trait) untuk tiap dimensi yang skornya di atas 60.
2. 3-5 rekomendasi karier HANYA dari daftar karier yang diberikan, diurutkan dari yang paling cocok, dengan matchPercentage (0-100).

Kembalikan HANYA JSON valid dengan skema:
{
  "topTraits": { 
    "direction": string[], 
    "nature": string[], 
    "ability": string[], 
    "careerFit": string[], 
    "growthPotential": string[] 
  },
  "recommendedCareers": [{ "careerRoleId": string, "title": string, "matchPercentage": number }]
}
Jangan menyertakan teks lain di luar JSON.`,
    userPrompt: `Skor 5 dimensi Career DNA:
- Direction (Arah Minat & Tujuan Karier): ${directionScore}/100
- Nature (Karakter Diri): ${natureScore}/100
- Ability (Kemampuan & Bakat): ${abilityScore}/100
- Career Fit (Kesesuaian Potensi): ${careerFitScore}/100
- Growth Potential (Potensi Pengembangan): ${growthPotentialScore}/100

Daftar karier yang tersedia di sistem (gunakan careerRoleId yang tepat):
${careerRoles.map(r => `- ID: ${r.id}, Title: "${r.title}", Category: "${r.category}"`).join("\n")}`,
  });

  // 5. Tentukan topTraits dan recommendedCareers
  // Jika Gemini gagal: simpan skor tetap, tapi topTraits/recommendedCareers kosong
  let topTraits: TopTraits = {
    direction: [], nature: [], ability: [], careerFit: [], growthPotential: [],
  };
  let recommendedCareers: { careerRoleId: string; title: string; matchPercentage: number }[] = [];

  if (geminiResult.success && geminiResult.data?.recommendedCareers?.length > 0) {
    topTraits = geminiResult.data.topTraits;
    recommendedCareers = geminiResult.data.recommendedCareers;
  } else {
    console.warn("[career-dna] Gemini unavailable/fallback:", geminiResult.success ? "empty recommendations" : geminiResult.error);
    const avgScore = Math.round((directionScore + natureScore + abilityScore + careerFitScore + growthPotentialScore) / 5);
    recommendedCareers = careerRoles.slice(0, 4).map((r, idx) => ({
      careerRoleId: r.id,
      title: r.title,
      matchPercentage: Math.max(65, Math.min(95, avgScore - idx * 4)),
    }));

    topTraits = {
      direction: directionScore >= 60 ? ["Tujuan Jelas", "Masa Depan Terarah"] : ["Perlu Eksplorasi"],
      nature: natureScore >= 60 ? ["Analitis & Sistematis", "Kolaboratif"] : ["Adaptif"],
      ability: abilityScore >= 60 ? ["Teknis Kuat", "Problem Solver"] : ["Sedang Berkembang"],
      careerFit: careerFitScore >= 60 ? ["Sangat Fit", "Fokus Industri"] : ["Cukup Fit"],
      growthPotential: growthPotentialScore >= 60 ? ["Pembelajar Cepat", "Tangguh"] : ["Potensial"],
    };
  }

  // 6. Simpan ke database (upsert untuk mendukung retake)
  const careerDNA = await prisma.careerDNA.upsert({
    where: { userId },
    create: {
      userId,
      directionScore,
      natureScore,
      abilityScore,
      careerFitScore,
      growthPotentialScore,
      rawAnswers: answers as any,
      topTraits: topTraits as any,
      recommendedCareers: recommendedCareers as any,
    },
    update: {
      directionScore,
      natureScore,
      abilityScore,
      careerFitScore,
      growthPotentialScore,
      rawAnswers: answers as any,
      topTraits: topTraits as any,
      recommendedCareers: recommendedCareers as any,
    },
  });

  // 7. Otomatis perbarui Career Readiness Score
  const { updateReadinessScore } = await import("@/lib/readiness-calculator");
  await updateReadinessScore(userId);

  const aiAvailable = geminiResult.success;

  return NextResponse.json(
    {
      success: true,
      data: {
        ...careerDNA,
        aiAvailable,
        isRetake,
      },
    },
    { status: isRetake ? 200 : 201 }
  );
}
