import { z } from "zod";

// Skema pertanyaan kuesioner Career DNA
export const rawAnswerSchema = z.object({
  id: z.string(),
  dimension: z.enum(["direction", "nature", "ability", "careerFit", "growthPotential"]),
  type: z.enum(["likert", "multiple-choice", "ranking"]),
  text: z.string(),
  value: z.number().min(0).max(10), // 1-5 untuk likert, lebih luas untuk fleksibilitas
});

// Schema untuk submit Career DNA Assessment
export const submitCareerDnaSchema = z.object({
  answers: z.array(rawAnswerSchema).min(25, "Minimal 25 pertanyaan harus dijawab"),
});

export type SubmitCareerDnaInput = z.infer<typeof submitCareerDnaSchema>;
