import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name cannot exceed 30 characters"),

    email: z.string().trim().min(1, "Email is required").email("Invalid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
