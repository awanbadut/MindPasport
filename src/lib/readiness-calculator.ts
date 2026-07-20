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
} from "@/lib/scoring";

/**
 * Menghitung ulang Career Readiness Score pengguna berdasarkan data terbaru
 * dari UserSkill, ProgressEntry, CareerDNA, dan Roadmap.
 * Dipanggil secara otomatis ketika ada pembaruan data di fitur-fitur terkait.
 */
export async function updateReadinessScore(userId: string) {
  try {
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

    // Hard Skill
    const hardSkillEntries = userSkills.filter(s => s.skill.category === "Hard Skill");
    const hardSkillScore = calculateHardSkillScore(hardSkillEntries);

    // Soft Skill
    const softSkillEntries = userSkills.filter(s => s.skill.category === "Soft Skill");
    const softSkillScore = calculateSoftSkillScore(softSkillEntries);

    // Pengalaman Praktis
    const practicalExperienceScore = calculatePracticalExperienceScore(
      progressEntries.map(e => ({ type: e.type, verified: e.verified }))
    );

    // Kepemimpinan
    const organizationCount = progressEntries.filter(e => e.type === "organization").length;
    const leadershipSkill = userSkills.find(
      s => s.skill.name.toLowerCase().includes("leadership") || s.skill.name.toLowerCase().includes("kepemimpinan")
    );
    const leadershipScore = calculateLeadershipScore(
      organizationCount,
      leadershipSkill?.currentScore ?? null
    );

    // Adaptasi (dari CareerDNA)
    const adaptabilityScore = calculateAdaptabilityScore(
      careerDNA?.growthPotentialScore ?? null
    );

    // Konsistensi (dari Roadmap aktif)
    const doneCount = roadmapItems.filter(i => i.status === "done").length;
    const consistencyScore = calculateConsistencyScore(doneCount, roadmapItems.length);

    // Hitung skor akhir dengan formula resmi CSR
    const finalScore = calculateCareerReadinessScore({
      hardSkill: hardSkillScore,
      softSkill: softSkillScore,
      practicalExperience: practicalExperienceScore,
      leadership: leadershipScore,
      adaptability: adaptabilityScore,
      consistency: consistencyScore,
    });

    const category = categorizeReadinessScore(finalScore);

    // Simpan entri baru ke riwayat
    return await prisma.readinessScoreHistory.create({
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
  } catch (err) {
    console.error("[updateReadinessScore] Error:", err);
    return null;
  }
}
