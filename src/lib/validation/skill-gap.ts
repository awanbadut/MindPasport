import { z } from "zod";

export const skillGapRequestSchema = z.object({
  careerRoleId: z.string().cuid(),
  userSkillScores: z
    .array(
      z.object({
        skillId: z.string().cuid(),
        score: z.number().int().min(0).max(100),
      })
    )
    .min(1, "Minimal satu skill harus dinilai"),
});

export type SkillGapRequestInput = z.infer<typeof skillGapRequestSchema>;
