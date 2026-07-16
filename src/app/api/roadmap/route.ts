import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createRoadmapSchema } from "@/lib/validation/roadmap";
import { generateJsonResponse } from "@/lib/gemini";
import type { GapDetail, RoadmapGeminiResponse, GapPriority } from "@/types";

// ==================== POST /api/roadmap ====================
// Generate roadmap dari hasil skill gap analysis

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
    const parseResult = createRoadmapSchema.safeParse(body);
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

    const { skillGapAnalysisId } = parseResult.data;

    // Ambil analisis gap dan cek kepemilikan
    const analysis = await prisma.skillGapAnalysis.findUnique({
      where: { id: skillGapAnalysisId },
      include: { careerRole: true },
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Analisis tidak ditemukan" } },
        { status: 404 }
      );
    }

    if (analysis.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Akses ditolak" } },
        { status: 403 }
      );
    }

    const gapDetails = (analysis.gapDetails as unknown) as GapDetail[];

    // Arsipkan roadmap aktif yang ada untuk analysis ini (hindari duplikasi)
    await prisma.skillRoadmap.updateMany({
      where: {
        userId: session.user.id,
        careerRoleId: analysis.careerRoleId,
        status: "active",
      },
      data: { status: "archived" },
    });

    // Urutkan gap details: Sangat Prioritas → Prioritas → Cukup Prioritas (Dipertahankan tidak masuk roadmap)
    const priorityOrder: GapPriority[] = ["Sangat Prioritas", "Prioritas", "Cukup Prioritas"];
    const skillsForRoadmap = gapDetails
      .filter(d => d.priority !== "Dipertahankan")
      .sort(
        (a, b) =>
          priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
      );

    if (skillsForRoadmap.length === 0) {
      // Semua skill sudah "Dipertahankan" — buat roadmap minimal
      const roadmap = await prisma.skillRoadmap.create({
        data: {
          userId: session.user.id,
          careerRoleId: analysis.careerRoleId,
          title: `Roadmap ${analysis.careerRole.title}`,
          status: "active",
          items: {
            create: [{
              stageNumber: 1,
              title: "Pertahankan Kompetensi",
              description: "Semua skill kamu sudah memenuhi atau melampaui standar industri. Terus pertahankan dan tingkatkan.",
              recommendedActivity: "Ikuti perkembangan industri, bagikan pengetahuan ke komunitas, ambil project/freelance untuk mempertajam keahlian.",
              priority: "Dipertahankan",
              status: "todo",
            }],
          },
        },
        include: { items: true, careerRole: true },
      });
      return NextResponse.json({ success: true, data: roadmap }, { status: 201 });
    }

    // Panggil Gemini untuk deskripsi dan rekomendasi aktivitas
    const geminiResult = await generateJsonResponse<RoadmapGeminiResponse>({
      systemInstruction: `Kamu adalah konselor karier yang menyusun roadmap pengembangan skill personal.
Berdasarkan daftar skill yang perlu dikembangkan (sudah diurutkan dari prioritas tertinggi ke terendah), 
tulis deskripsi dan rekomendasi aktivitas konkret untuk tiap skill.

PENTING:
- JANGAN mengubah urutan skill — urutan sudah ditentukan oleh sistem berdasarkan analisis gap
- Rekomendasi aktivitas berupa nama jenis kegiatan/topik (bukan URL spesifik ke platform)
- Deskripsi singkat (1-2 kalimat) menjelaskan mengapa skill ini penting dan apa yang akan dicapai

Kembalikan HANYA JSON valid dengan skema:
{
  "items": [
    {
      "skillId": string | null,
      "skillName": string,
      "stageNumber": number,
      "title": string,
      "description": string,
      "recommendedActivity": string,
      "priority": "Sangat Prioritas" | "Prioritas" | "Cukup Prioritas"
    }
  ]
}`,
      userPrompt: `Career target: ${analysis.careerRole.title}
      
Skill yang perlu dikembangkan (sudah diurutkan dari prioritas tertinggi):
${skillsForRoadmap.map((s, i) => 
  `${i+1}. [${s.priority}] ${s.skillName} (skor kamu: ${s.userScore}, standar: ${s.industryScore}, gap: ${s.gap})`
).join("\n")}`,
    });

    let roadmapItems: Array<{
      skillId: string | null;
      stageNumber: number;
      title: string;
      description: string;
      recommendedActivity: string;
      priority: string;
      status: string;
    }>;

    if (geminiResult.success && geminiResult.data.items?.length > 0) {
      // Pastikan urutan dari Gemini mengikuti urutan prioritas yang sudah ditentukan
      // GEMINI hanya boleh mengubah deskripsi, BUKAN urutan
      roadmapItems = skillsForRoadmap.map((skill, index) => {
        const geminiItem = geminiResult.data.items.find(
          (i) => i.skillName === skill.skillName || i.skillId === skill.skillId
        );
        return {
          skillId: skill.skillId,
          stageNumber: index + 1,
          title: geminiItem?.title ?? `Kembangkan ${skill.skillName}`,
          description: geminiItem?.description ?? `Tingkatkan kemampuan ${skill.skillName} dari ${skill.userScore} menuju standar ${skill.industryScore}.`,
          recommendedActivity: geminiItem?.recommendedActivity ?? `Pelatihan/kursus ${skill.skillName}`,
          priority: skill.priority,
          status: "todo",
        };
      });
    } else {
      // FALLBACK: template statis karena Gemini gagal
      console.warn("[roadmap] Gemini gagal, menggunakan fallback template statis");
      roadmapItems = skillsForRoadmap.map((skill, index) => ({
        skillId: skill.skillId,
        stageNumber: index + 1,
        title: `Kembangkan ${skill.skillName}`,
        description: `Tingkatkan kemampuan ${skill.skillName} dari skor ${skill.userScore} menuju standar industri ${skill.industryScore}. Gap saat ini: ${skill.gap} poin.`,
        recommendedActivity: `Ikuti pelatihan ${skill.skillName}, kerjakan proyek praktik, atau dapatkan sertifikasi terkait.`,
        priority: skill.priority,
        status: "todo",
      }));
    }

    // Simpan roadmap ke database
    const roadmap = await prisma.skillRoadmap.create({
      data: {
        userId: session.user.id,
        careerRoleId: analysis.careerRoleId,
        title: `Roadmap ${analysis.careerRole.title}`,
        status: "active",
        items: {
          create: roadmapItems,
        },
      },
      include: {
        items: { orderBy: { stageNumber: "asc" } },
        careerRole: true,
      },
    });

    return NextResponse.json({ success: true, data: roadmap }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/roadmap] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// ==================== GET /api/roadmap ====================
// Daftar roadmap milik user

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const roadmaps = await prisma.skillRoadmap.findMany({
      where: { userId: session.user.id },
      include: {
        careerRole: true,
        items: { orderBy: { stageNumber: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: roadmaps });
  } catch (err) {
    console.error("[GET /api/roadmap] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
