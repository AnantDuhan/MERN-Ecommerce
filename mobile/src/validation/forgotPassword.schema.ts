import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address"),
});

export type ForgotPasswordForm =
  z.infer<typeof forgotPasswordSchema>;