import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  userName: z.string(),
  email: z.string(),
  role: z.enum(["admin", "normal"]),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userListSchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;

export interface CreateUserDto {
  fullName: string;
  userName: string;
  password: string;
  email: string;
  role: "admin" | "normal";
}

export interface UpdateUserDto {
  fullName?: string;
  userName?: string;
  email?: string;
  role?: "admin" | "normal";
}
