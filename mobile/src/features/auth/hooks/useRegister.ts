import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

import { AuthRepository } from "../repositories/auth.repository";

import { SecureStorageService } from "@/services/secure-storage.service";
import { useAuthStore } from "@/store/auth.store";

export function useRegister() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: AuthRepository.register,

    onSuccess: async (response) => {
      await SecureStorageService.saveToken(response.token);

      login(response.user, response.token);

      router.replace("/(tabs)");
    },
  });
}
