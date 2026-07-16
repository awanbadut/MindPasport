import { z } from "zod";

export const createRoadmapSchema = z.object({
  skillGapAnalysisId: z.string().cuid(),
});

export const updateRoadmapItemSchema = z.object({
  status: z.enum(["todo", "in-progress", "done"]),
});

export type CreateRoadmapInput = z.infer<typeof createRoadmapSchema>;
export type UpdateRoadmapItemInput = z.infer<typeof updateRoadmapItemSchema>;
