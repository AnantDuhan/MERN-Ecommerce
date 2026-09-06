import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

import { AuthRepository } from "../repositories/auth.repository";
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password";

export function useResetPassword() {
  return useMutation<
    ResetPasswordResponse,
    Error,
    ResetPasswordRequest
  >({
    mutationFn: AuthRepository.resetPassword,

    onSuccess: () => {
      router.replace("/login");
    },
  });
}