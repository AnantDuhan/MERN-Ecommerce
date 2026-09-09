import { z } from "zod";

/**
 * Shared Validators
 */
const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(30, "Name cannot exceed 30 characters");

const avatarSchema = z.object({
  uri: z.string(),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
});

/**
 * Login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register
 */
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    avatar: avatarSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot Password
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<
  typeof forgotPasswordSchema
>;

/**
 * Reset Password
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordFormData = z.infer<
  typeof resetPasswordSchema
>;

/**
 * Update Password
 */
export const updatePasswordSchema = z
  .object({
    oldPassword: passwordSchema,

    newPassword: passwordSchema,

    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UpdatePasswordFormData = z.infer<
  typeof updatePasswordSchema
>;