import { useMutation } from "@tanstack/react-query";
import { AuthRepository } from "../repositories/auth.repository";

interface Payload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: Payload) => AuthRepository.updatePassword(payload),
  });
}
