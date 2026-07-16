import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  calculateHardSkillScore,
  calculateSoftSkillScore,
  calculatePracticalExperienceScore,
  calculateLeadershipScore,
  calculateAdaptabilityScore,
  calculateConsistencyScore,
  calculateCareerReadinessScore,
  categorizeReadinessScore,
  clampScore,
} from "@/lib/scoring";

// ==================== POST /api/readiness-score/calculate ====================
// Hitung ulang skor berdasarkan data terbaru, simpan entri baru di history

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

    // Ambil semua data yang dibutuhkan untuk perhitungan
    const [userSkills, progressEntries, careerDNA, roadmapItems] = await Promise.all([
      prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true },
      }),
      prisma.progressEntry.findMany({ where: { userId } }),
      prisma.careerDNA.findUnique({ where: { userId } }),
      prisma.roadmapItem.findMany({
        where: { roadmap: { userId, status: "active" } },
      }),
    ]);

    // Hard Skill: rata-rata UserSkill kategori "Hard Skill"
    const hardSkillEntries = userSkills.filter(s => s.skill.category === "Hard Skill");
    const hardSkillScore = calculateHardSkillScore(hardSkillEntries);

    // Soft Skill: rata-rata UserSkill kategori "Soft Skill"
    const softSkillEntries = userSkills.filter(s => s.skill.category === "Soft Skill");
    const softSkillScore = calculateSoftSkillScore(softSkillEntries);

    // Pengalaman Praktis: dari ProgressEntry tipe internship/project/competition/volunteer
    const practicalExperienceScore = calculatePracticalExperienceScore(
      progressEntries.map(e => ({ type: e.type, verified: e.verified }))
    );

    // Kepemimpinan: dari jumlah entri organisasi + skill Leadership (jika ada)
    const organizationCount = progressEntries.filter(e => e.type === "organization").length;
    const leadershipSkill = userSkills.find(
      s => s.skill.name.toLowerCase().includes("leadership") || s.skill.name.toLowerCase().includes("kepemimpinan")
    );
    const leadershipScore = calculateLeadershipScore(
      organizationCount,
      leadershipSkill?.currentScore ?? null
    );

    // Adaptasi: dari CareerDNA.growthPotentialScore
    const adaptabilityScore = calculateAdaptabilityScore(
      careerDNA?.growthPotentialScore ?? null
    );

    // Konsistensi: dari rasio done/total roadmap items aktif
    const doneCount = roadmapItems.filter(i => i.status === "done").length;
    const consistencyScore = calculateConsistencyScore(doneCount, roadmapItems.length);

    // Hitung Career Readiness Score dengan formula resmi (WAJIB PERSIS)
    const finalScore = calculateCareerReadinessScore({
      hardSkill: hardSkillScore,
      softSkill: softSkillScore,
      practicalExperience: practicalExperienceScore,
      leadership: leadershipScore,
      adaptability: adaptabilityScore,
      consistency: consistencyScore,
    });

    const category = categorizeReadinessScore(finalScore);

    // Simpan sebagai entri baru (jangan overwrite — ini riwayat untuk grafik tren)
    const scoreEntry = await prisma.readinessScoreHistory.create({
      data: {
        userId,
        hardSkillScore,
        softSkillScore,
        practicalExperienceScore,
        leadershipScore,
        adaptabilityScore,
        consistencyScore,
        finalScore,
        category,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...scoreEntry,
        displayScore: Math.round(finalScore), // dibulatkan untuk tampilan
        components: {
          hardSkill: hardSkillScore,
          softSkill: softSkillScore,
          practicalExperience: practicalExperienceScore,
          leadership: leadershipScore,
          adaptability: adaptabilityScore,
          consistency: consistencyScore,
        },
      },
    });
  } catch (err) {
    console.error("[POST /api/readiness-score/calculate] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
