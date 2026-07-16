import { z } from "zod";

export const updatePassportSchema = z.object({
  isPublic: z.boolean().optional(),
  regenerateSlug: z.boolean().optional(),
});

export type UpdatePassportInput = z.infer<typeof updatePassportSchema>;
