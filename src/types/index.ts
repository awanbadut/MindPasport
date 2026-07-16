// Shared TypeScript types - satu-satunya sumber kebenaran untuk tipe JSON fields
// Semua Json field di Prisma harus menggunakan tipe yang didefinisikan di sini

// ==================== Career DNA ====================

export interface RawAnswer {
  id: string;
  dimension: "direction" | "nature" | "ability" | "careerFit" | "growthPotential";
  type: "likert" | "multiple-choice" | "ranking";
  text: string;
  value: number; // untuk likert: 1-5; untuk MC: index pilihan; untuk ranking: posisi
}

export interface TopTraits {
  direction: string[];
  nature: string[];
  ability: string[];
  careerFit: string[];
  growthPotential: string[];
}

export interface RecommendedCareer {
  careerRoleId: string;
  title: string;
  matchPercentage: number;
}

// ==================== Skill Gap Analysis ====================

export type GapCategory = "Sangat Rendah" | "Rendah" | "Sedang" | "Tinggi";
export type GapPriority = "Sangat Prioritas" | "Prioritas" | "Cukup Prioritas" | "Dipertahankan";

export interface GapDetail {
  skillId: string;
  skillName: string;
  skillCategory: string;
  weight: number;       // weightPercent dari IndustryStandardSkill
  userScore: number;    // 0-100
  industryScore: number; // standardScore dari IndustryStandardSkill
  gap: number;          // userScore - industryScore (bisa negatif)
  gapCategory: GapCategory;
  priority: GapPriority;
}

// ==================== AI Navigator ====================

export type RecommendationType = "training" | "internship" | "project" | "career-path";

export interface NavigatorRecommendation {
  type: RecommendationType;
  title: string;
  reason: string;
  url: string | null;
}

// ==================== Industry Match ====================

export interface MatchingSkill {
  skillId: string;
  skillName: string;
  userScore: number;
  industryScore: number;
}

export interface MissingSkill {
  skillId: string;
  skillName: string;
  userScore: number;
  industryScore: number;
  gap: number;
}

// ==================== Progress Entry ====================

export type ProgressEntryType =
  | "training"
  | "organization"
  | "internship"
  | "project"
  | "competition"
  | "volunteer"
  | "certificate";

// ==================== Readiness Score Categories ====================

export type ReadinessCategory = "Belum Siap" | "Berkembang" | "Cukup Siap" | "Sangat Siap";

// ==================== API Response ====================

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ==================== Session User ====================

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "MENTOR" | "ADMIN";
}

// ==================== Career DNA Gemini Response ====================

export interface CareerDnaGeminiResponse {
  topTraits: TopTraits;
  recommendedCareers: RecommendedCareer[];
}

// ==================== Roadmap Gemini Response ====================

export interface RoadmapGeminiItem {
  skillId: string | null;
  skillName: string;
  stageNumber: number;
  title: string;
  description: string;
  recommendedActivity: string;
  priority: GapPriority;
}

export interface RoadmapGeminiResponse {
  items: RoadmapGeminiItem[];
}

// ==================== Navigator Gemini Response ====================

export interface NavigatorGeminiResponse {
  recommendations: NavigatorRecommendation[];
}

// ==================== Industry Match Gemini Response ====================

export interface IndustryMatchNarrativeResponse {
  narratives: {
    careerRoleId: string;
    narrative: string;
  }[];
}
