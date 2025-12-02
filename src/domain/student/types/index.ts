import { z } from "zod";

// Schemas
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
  plan: planSchema,
  area: areaSchema,
});

export const studentSchema = z.object({
  id: z.string(),
  identification: z.string(),
  email: z.string(),
  names: z.string(),
  lastNames: z.string(),
  semester: z.number(),
  cityResidence: z.string(),
  gender: z.enum(["Masculino", "Femenino", "Otro"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  approvedSubjects: z.array(subjectSchema).optional(),
  subjectsToHomologate: z.array(subjectSchema).optional(),
  subjectsToView: z.array(subjectSchema).optional(),
});

export const createStudentResponseSchema = z.object({
  message: z.string(),
  student: z.object({
    identification: z.string(),
    email: z.string(),
    names: z.string(),
    lastNames: z.string(),
    semester: z.number(),
    cityResidence: z.string(),
    gender: z.enum(["Masculino", "Femenino", "Otro"]),
  }),
  subjectsToHomologate: z.array(subjectSchema),
  subjectsToView: z.array(subjectSchema),
});

export const studentReportSchema = z.object({
  id: z.string(),
  identification: z.string(),
  email: z.string(),
  names: z.string(),
  lastNames: z.string(),
  semester: z.number(),
  cityResidence: z.string(),
  gender: z.enum(["Masculino", "Femenino", "Otro"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  subjectsToHomologate: z.array(subjectSchema),
  subjectsToView: z.array(subjectSchema),
});

export const studentListSchema = z.array(studentSchema);

// Types
export type Area = z.infer<typeof areaSchema>;
export type Plan = z.infer<typeof planSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type Student = z.infer<typeof studentSchema>;
export type CreateStudentResponse = z.infer<typeof createStudentResponseSchema>;
export type StudentReport = z.infer<typeof studentReportSchema>;

// DTOs
export interface CreateStudentDto {
  studentData: {
    identification: string;
    email: string;
    names: string;
    lastNames: string;
    semester: number;
    cityResidence: string;
    gender: "Masculino" | "Femenino" | "Otro";
  };
  approvedSubjects: {
    approvedSubjectVersionId: number;
  }[];
}

export interface UpdateStudentDto {
  studentData?: {
    identification?: string;
    email?: string;
    names?: string;
    lastNames?: string;
    semester?: number;
    cityResidence?: string;
    address?: string;
    telephone?: string;
    gender?: "Masculino" | "Femenino" | "Otro";
  };
  approvedSubjects?: {
    approvedSubjectVersionId: number;
  }[];
}
