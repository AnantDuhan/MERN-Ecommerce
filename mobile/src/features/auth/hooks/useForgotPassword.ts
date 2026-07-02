import { useMutation } from "@tanstack/react-query";

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
    mutationFn: (data) =>
      AuthRepository.forgotPassword(data),

    onSuccess: (response) => {
      console.log(response.message);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}