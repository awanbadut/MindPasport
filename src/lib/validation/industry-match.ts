import { z } from "zod";

export const industryMatchRequestSchema = z.object({
  careerRoleId: z.string().cuid().optional(),
});

export type IndustryMatchRequestInput = z.infer<typeof industryMatchRequestSchema>;
