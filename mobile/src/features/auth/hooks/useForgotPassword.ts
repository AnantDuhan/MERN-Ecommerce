import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

import { AuthRepository } from "../repositories/auth.repository";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../types/forgot-password";

export function useForgotPassword() {
  return useMutation<
    ForgotPasswordResponse,
    Error,
    ForgotPasswordRequest
  >({
    mutationFn: AuthRepository.forgotPassword,

    onSuccess: (_, variables) => {
      router.replace({
        pathname: "/check-email",
        params: {
          email: variables.email,
        },
      });
    },

    onError: (error) => {
      alert(error.message);
    },
  });
}