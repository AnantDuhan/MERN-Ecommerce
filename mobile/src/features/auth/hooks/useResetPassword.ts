import { useMutation } from "@tanstack/react-query";

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
    mutationFn: (data) =>
      AuthRepository.resetPassword(data),

    onSuccess: () => {
      console.log("Password Updated");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}