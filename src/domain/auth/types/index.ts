import { z } from "zod";

export const loginDataSchema = z.object({
  userName: z.string(),
  password: z.string(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  userName: z.string(),
  role: z.string(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export type LoginPayload = z.infer<typeof loginDataSchema>;

export type LoginResponse = { token: string };
