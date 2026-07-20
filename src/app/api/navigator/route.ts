import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateJsonResponse } from "@/lib/gemini";
import type { NavigatorGeminiResponse } from "@/types";

// Rate limiting sederhana: track last request time per user di memory
// TODO: gunakan Redis/Upstash untuk production yang lebih robust
const userLastRequest = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000; // 1 menit per user

// ==================== POST /api/navigator ====================
// Minta rekomendasi baru dari Gemini berdasarkan profil lengkap user

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Rate limit: maksimal 1x per menit per user
    const lastRequest = userLastRequest.get(userId);
    const now = Date.now();
    if (lastRequest && now - lastRequest < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastRequest)) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: `Tunggu ${remaining} detik sebelum minta rekomendasi lagi`,
          },
        },
        { status: 429 }
      );
    }

    // Kumpulkan konteks lengkap user (sesuai 12-fitur-ai-career-navigator.md)
    const [careerDNA, latestSkillGap, roadmapData, latestReadiness, progressEntries] = await Promise.all([
      prisma.careerDNA.findUnique({ where: { userId } }),
      prisma.skillGapAnalysis.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { careerRole: true },
      }),
      prisma.skillRoadmap.findFirst({
        where: { userId, status: "active" },
        include: {
          items: { orderBy: { stageNumber: "asc" } },
          careerRole: true,
        },
      }),
      prisma.readinessScoreHistory.findFirst({
        where: { userId },
        orderBy: { calculatedAt: "desc" },
      }),
      prisma.progressEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    // Rangkum konteks untuk prompt (jangan kirim seluruh raw database)
    const prioritySkills = latestSkillGap
      ? ((latestSkillGap.gapDetails as unknown) as { skillName: string; priority: string }[])
          .filter(d => d.priority === "Sangat Prioritas" || d.priority === "Prioritas")
          .map(d => `${d.skillName} (${d.priority})`)
          .slice(0, 5)
      : [];

    const roadmapProgress = roadmapData
      ? `${(roadmapData as any).items.filter((i: any) => i.status === "done").length}/${(roadmapData as any).items.length} item selesai`
      : "Belum ada roadmap";

    const promptContext = `
Profil Career DNA:
- Direction: ${careerDNA?.directionScore ?? "N/A"}/100
- Nature: ${careerDNA?.natureScore ?? "N/A"}/100
- Ability: ${careerDNA?.abilityScore ?? "N/A"}/100
- Career Fit: ${careerDNA?.careerFitScore ?? "N/A"}/100
- Growth Potential: ${careerDNA?.growthPotentialScore ?? "N/A"}/100

Target karier: ${latestSkillGap?.careerRole?.title ?? "Belum dipilih"}

Skill yang perlu dikembangkan (prioritas):
${prioritySkills.length > 0 ? prioritySkills.join("\n") : "Belum ada analisis skill gap"}

Progress roadmap: ${roadmapProgress}

Career Readiness Score terbaru: ${latestReadiness ? `${Math.round(latestReadiness.finalScore)}/100 (${latestReadiness.category})` : "Belum dihitung"}

Aktivitas pengembangan terakhir (5 terbaru):
${progressEntries.slice(0, 5).map(e => `- ${e.type}: ${e.title}`).join("\n") || "Belum ada aktivitas"}
    `.trim();

    // Panggil Gemini untuk rekomendasi
    const geminiResult = await generateJsonResponse<NavigatorGeminiResponse>({
      systemInstruction: `Kamu adalah AI Career Navigator untuk platform Mind Passport.
Berdasarkan profil lengkap pengguna (Career DNA, skill gap, roadmap progress, career readiness score, aktivitas terakhir),
berikan 4-6 rekomendasi konkret yang beragam (training, internship, project, career-path).

PENTING:
- Rekomendasikan berdasarkan data nyata yang diberikan, jangan mengarang
- Jangan cantumkan URL spesifik ke platform (risiko halusinasi) — cukup nama/topik
- Tiap rekomendasi harus punya alasan yang terhubung dengan data user
- Campuran type: training, internship, project, career-path

Kembalikan HANYA JSON valid:
{
  "recommendations": [
    {
      "type": "training" | "internship" | "project" | "career-path",
      "title": string,
      "reason": string,
      "url": null
    }
  ]
}`,
      userPrompt: promptContext,
    });

    let recommendations = geminiResult.success ? geminiResult.data?.recommendations : [];

    if (!recommendations || recommendations.length === 0) {
      console.warn("[navigator] Gemini unavailable/fallback:", geminiResult.success ? "empty recommendations" : geminiResult.error);
      const targetTitle = latestSkillGap?.careerRole?.title ?? "Digital Specialist";
      const topSkillName = prioritySkills[0]?.split(" ")[0] ?? "Kompetensi Utama";
      recommendations = [
        {
          type: "training",
          title: `Pelatihan Intensif ${topSkillName}`,
          reason: `Membantu Anda memperkecil gap pada ${topSkillName} sesuai target karier ${targetTitle}.`,
          url: null,
        },
        {
          type: "project",
          title: `Proyek Portofolio ${targetTitle}`,
          reason: `Implementasi praktis keahlian Anda untuk membuktikan kompetensi di industri.`,
          url: null,
        },
        {
          type: "internship",
          title: `Program Magang / Studi Independen ${targetTitle}`,
          reason: `Meningkatkan skor Pengalaman Praktis pada indikator Career Readiness Anda.`,
          url: null,
        },
        {
          type: "career-path",
          title: `Eksplorasi Peran ${targetTitle}`,
          reason: `Berada dalam jalur pengembangan utama sesuai hasil Career DNA & Skill Gap Anda.`,
          url: null,
        },
      ];
    }

    // Update rate limit tracker
    userLastRequest.set(userId, now);

    // Simpan ke AiNavigatorLog
    const log = await prisma.aiNavigatorLog.create({
      data: {
        userId,
        prompt: promptContext.slice(0, 500), // simpan ringkasan, bukan prompt penuh
        recommendations: recommendations as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: log.id,
        createdAt: log.createdAt,
        recommendations,
      },
    });
  } catch (err) {
    console.error("[POST /api/navigator] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// ==================== GET /api/navigator ====================
// Riwayat rekomendasi

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const logs = await prisma.aiNavigatorLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      // Jangan expose raw prompt ke frontend
      select: {
        id: true,
        recommendations: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (err) {
    console.error("[GET /api/navigator] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
