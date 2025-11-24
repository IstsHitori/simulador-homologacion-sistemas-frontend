import { z } from "zod";

export const areaSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const planSchema = z.object({
  id: z.number(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
});

export const subjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  semester: z.number(),
  credits: z.number(),
  area: areaSchema,
});

export const planWithSubjectsSchema = z.object({
  plan: planSchema,
  subjects: z.array(subjectSchema),
  quantity: z.number(),
});

export const plansResponseSchema = z.object({
  oldPlan: planWithSubjectsSchema,
  newPlan: planWithSubjectsSchema,
});

export type Area = z.infer<typeof areaSchema>;
export type Plan = z.infer<typeof planSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type PlanWithSubjects = z.infer<typeof planWithSubjectsSchema>;
export type PlansResponse = z.infer<typeof plansResponseSchema>;
