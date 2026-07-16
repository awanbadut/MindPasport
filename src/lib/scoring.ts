/**
 * scoring.ts — Pure functions untuk semua formula kalkulasi Mind Passport.
 * Semua formula HARUS murni (pure): tidak ada side effect, tidak ada DB call.
 * Fitur lain memanggil fungsi ini, bukan menghitung ulang sendiri.
 *
 * Formula Career Readiness Score (CSR) WAJIB persis sesuai 11-fitur-career-readiness-score.md.
 * Formula Skill Gap WAJIB persis sesuai 07-fitur-skill-gap-analysis.md.
 */

import type { GapCategory, GapDetail, GapPriority, ReadinessCategory } from "@/types";

// ==================== CAREER DNA SCORING ====================

/**
 * Menghitung skor satu dimensi Career DNA dari array jawaban Likert.
 * Formula: round((sum(values) / (count * maxScale)) * 100)
 * sesuai 06-fitur-career-dna-assessment.md
 */
export function calculateDimensionScore(
  values: number[],
  maxScale: number = 5
): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  const maxPossible = values.length * maxScale;
  return Math.round((sum / maxPossible) * 100);
}

// ==================== SKILL GAP ANALYSIS ====================

/**
 * Menghitung gap satu skill.
 * gap = userScore - industryScore (bisa negatif)
 * Sesuai 07-fitur-skill-gap-analysis.md
 */
export function calculateSkillGap(userScore: number, industryScore: number): number {
  return userScore - industryScore;
}

/**
 * Menentukan kategori gap berdasarkan nilai absolut gap.
 * Sesuai tabel di 07-fitur-skill-gap-analysis.md (WAJIB PERSIS).
 */
export function categorizeGap(gap: number): GapCategory {
  const absGap = Math.abs(gap);
  if (absGap <= 4) return "Sangat Rendah";
  if (absGap <= 9) return "Rendah";
  if (absGap <= 19) return "Sedang";
  return "Tinggi";
}

/**
 * Menentukan prioritas pengembangan berdasarkan gap dan kategorinya.
 * Sesuai tabel di 07-fitur-skill-gap-analysis.md (WAJIB PERSIS).
 */
export function determineGapPriority(gap: number, category: GapCategory): GapPriority {
  if (gap >= 0) return "Dipertahankan";
  if (category === "Sangat Rendah" || category === "Rendah") return "Cukup Prioritas";
  if (category === "Sedang") return "Prioritas";
  return "Sangat Prioritas"; // Tinggi
}

/**
 * Menghitung overallReadinessPercent untuk Skill Gap Analysis.
 * Formula: round(sum(bobot_i * userScore_i) / sum(bobot_i * industryScore_i) * 100)
 * Sesuai 07-fitur-skill-gap-analysis.md (WAJIB PERSIS).
 * Selalu hitung berdasarkan proporsi bobot yang ada, tidak asumsikan total = 100.
 */
export function calculateOverallReadiness(
  skills: Array<{ weight: number; userScore: number; industryScore: number }>
): number {
  const weightedUser = skills.reduce((acc, s) => acc + s.weight * s.userScore, 0);
  const weightedIndustry = skills.reduce((acc, s) => acc + s.weight * s.industryScore, 0);
  if (weightedIndustry === 0) return 0;
  return Math.round((weightedUser / weightedIndustry) * 100);
}

/**
 * Menghitung totalGapPoints (sum semua gap, bisa negatif).
 * Sesuai 07-fitur-skill-gap-analysis.md.
 */
export function calculateTotalGapPoints(gaps: number[]): number {
  return gaps.reduce((acc, g) => acc + g, 0);
}

/**
 * Membangun GapDetail lengkap untuk satu skill.
 */
export function buildGapDetail(params: {
  skillId: string;
  skillName: string;
  skillCategory: string;
  weight: number;
  userScore: number;
  industryScore: number;
}): GapDetail {
  const gap = calculateSkillGap(params.userScore, params.industryScore);
  const gapCategory = categorizeGap(gap);
  const priority = determineGapPriority(gap, gapCategory);
  return {
    skillId: params.skillId,
    skillName: params.skillName,
    skillCategory: params.skillCategory,
    weight: params.weight,
    userScore: params.userScore,
    industryScore: params.industryScore,
    gap,
    gapCategory,
    priority,
  };
}

// ==================== CAREER READINESS SCORE ====================

/**
 * Formula resmi Career Readiness Score (CSR).
 * CSR = 0.25*HS + 0.25*SS + 0.20*PP + 0.15*K + 0.10*A + 0.05*KP
 * WAJIB PERSIS seperti di 11-fitur-career-readiness-score.md. JANGAN DIUBAH.
 *
 * Semua input sudah di-clamp ke 0-100 sebelum masuk fungsi ini.
 */
export function calculateCareerReadinessScore(input: {
  hardSkill: number;
  softSkill: number;
  practicalExperience: number;
  leadership: number;
  adaptability: number;
  consistency: number;
}): number {
  const { hardSkill, softSkill, practicalExperience, leadership, adaptability, consistency } = input;
  return (
    0.25 * hardSkill +
    0.25 * softSkill +
    0.20 * practicalExperience +
    0.15 * leadership +
    0.10 * adaptability +
    0.05 * consistency
  );
}

/**
 * Menentukan kategori Career Readiness Score.
 * Sesuai tabel di 11-fitur-career-readiness-score.md (WAJIB PERSIS).
 */
export function categorizeReadinessScore(score: number): ReadinessCategory {
  if (score < 40) return "Belum Siap";
  if (score < 60) return "Berkembang";
  if (score < 80) return "Cukup Siap";
  return "Sangat Siap";
}

/**
 * Clamp nilai ke rentang 0-100.
 * Wajib digunakan sebelum memasukkan komponen ke calculateCareerReadinessScore.
 */
export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Menghitung Hard Skill Score dari array UserSkill berkategori "Hard Skill".
 * HS = rata-rata currentScore semua skill Hard Skill user.
 * Kalau kosong, HS = 0.
 */
export function calculateHardSkillScore(
  hardSkills: Array<{ currentScore: number }>
): number {
  if (hardSkills.length === 0) return 0;
  const sum = hardSkills.reduce((acc, s) => acc + s.currentScore, 0);
  return clampScore(Math.round(sum / hardSkills.length));
}

/**
 * Menghitung Soft Skill Score dari array UserSkill berkategori "Soft Skill".
 * SS = rata-rata currentScore semua skill Soft Skill user.
 * Kalau kosong, SS = 0.
 */
export function calculateSoftSkillScore(
  softSkills: Array<{ currentScore: number }>
): number {
  if (softSkills.length === 0) return 0;
  const sum = softSkills.reduce((acc, s) => acc + s.currentScore, 0);
  return clampScore(Math.round(sum / softSkills.length));
}

/**
 * Menghitung Pengalaman Praktis (PP) dari ProgressEntry.
 * PP = min(100, sum per entry: verified ? 10 : 5)
 * Tipe yang dihitung: internship, project, competition, volunteer.
 * Sesuai 11-fitur-career-readiness-score.md.
 */
export function calculatePracticalExperienceScore(
  entries: Array<{ type: string; verified: boolean }>
): number {
  const practicalTypes = ["internship", "project", "competition", "volunteer"];
  const practicalEntries = entries.filter(e => practicalTypes.includes(e.type));
  const total = practicalEntries.reduce((acc, e) => acc + (e.verified ? 10 : 5), 0);
  return clampScore(total);
}

/**
 * Menghitung Kepemimpinan (K).
 * K = round((min(jumlahOrganisasi*15, 100)*0.5) + (leadershipSkillScore*0.5))
 * Kalau tidak ada skill Leadership, hanya dari jumlah organisasi (bobot 100%).
 * Sesuai 11-fitur-career-readiness-score.md.
 */
export function calculateLeadershipScore(
  organizationCount: number,
  leadershipSkillScore: number | null
): number {
  const orgComponent = clampScore(organizationCount * 15);
  if (leadershipSkillScore === null) {
    // Hanya komponen organisasi, bobot 100%
    return clampScore(orgComponent);
  }
  return clampScore(Math.round(orgComponent * 0.5 + leadershipSkillScore * 0.5));
}

/**
 * Menghitung Adaptasi (A) dari CareerDNA.growthPotentialScore.
 * A = growthPotentialScore (atau 0 kalau belum isi Career DNA).
 * Sesuai 11-fitur-career-readiness-score.md.
 */
export function calculateAdaptabilityScore(
  growthPotentialScore: number | null
): number {
  return clampScore(growthPotentialScore ?? 0);
}

/**
 * Menghitung Konsistensi Pengembangan (KP) dari RoadmapItem.
 * KP = round((doneCount / totalActive) * 100)
 * Kalau tidak ada roadmap, KP = 0.
 * Sesuai 11-fitur-career-readiness-score.md.
 */
export function calculateConsistencyScore(
  doneCount: number,
  totalActiveItems: number
): number {
  if (totalActiveItems === 0) return 0;
  return clampScore(Math.round((doneCount / totalActiveItems) * 100));
}

// ==================== INDUSTRY MATCH ====================

/**
 * Menghitung matchPercent untuk Industry Match.
 * matchPercent = round(sum(bobot_i * min(userScore_i, industryScore_i)) / sum(bobot_i * industryScore_i) * 100)
 * Sesuai 13-fitur-industry-match-recommendation.md (WAJIB PERSIS).
 * Kalau user tidak punya skill tertentu, userScore = 0.
 */
export function calculateMatchPercent(
  skills: Array<{ weight: number; userScore: number; industryScore: number }>
): number {
  const weightedActual = skills.reduce(
    (acc, s) => acc + s.weight * Math.min(s.userScore, s.industryScore),
    0
  );
  const weightedStandard = skills.reduce(
    (acc, s) => acc + s.weight * s.industryScore,
    0
  );
  if (weightedStandard === 0) return 0;
  return Math.round((weightedActual / weightedStandard) * 100);
}

// ==================== PROGRESS → SKILL ====================

/**
 * Menghitung kenaikan skor skill dari satu aktivitas progress.
 * Setiap aktivitas dengan skill terkait menaikkan skor +2 sampai +5 poin,
 * dengan cap maksimal 100. (opsional, lihat 09-fitur-skill-progress-tracker.md)
 *
 * Return: skor baru setelah kenaikan (sudah di-clamp ke 100)
 */
export function applyProgressToSkill(
  currentScore: number,
  activityType: string
): number {
  // ASUMSI: training/certificate/internship memberikan +5, lainnya +2
  const bonusMap: Record<string, number> = {
    training: 5,
    certificate: 5,
    internship: 5,
    project: 3,
    competition: 3,
    volunteer: 2,
    organization: 2,
  };
  const bonus = bonusMap[activityType] ?? 2;
  return clampScore(currentScore + bonus);
}
