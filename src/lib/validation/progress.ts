import { z } from "zod";

const progressEntryTypeSchema = z.enum([
  "training",
  "organization",
  "internship",
  "project",
  "competition",
  "volunteer",
  "certificate",
]);

export const createProgressEntrySchema = z.object({
  type: progressEntryTypeSchema,
  title: z.string().min(1, "Judul wajib diisi").max(255),
  organizer: z.string().max(255).optional(),
  description: z.string().max(2000).optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  certificateUrl: z.string().url("URL sertifikat tidak valid").optional().nullable(),
  relatedSkillIds: z.array(z.string().cuid()).optional().nullable(),
});

export const updateProgressEntrySchema = createProgressEntrySchema.partial();

export type CreateProgressEntryInput = z.infer<typeof createProgressEntrySchema>;
export type UpdateProgressEntryInput = z.infer<typeof updateProgressEntrySchema>;
