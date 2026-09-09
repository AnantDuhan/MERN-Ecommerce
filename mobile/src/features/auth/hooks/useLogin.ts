import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { AuthRepository } from "../repositories/auth.repository";
import { LoginRequest, LoginResponse } from "../types/login";
import { useAuthStore } from "@/store/auth.store";
import { SecureStorageService } from "@/services/secure-storage.service";

export function useLogin() {
  const login = useAuthStore(
    (state) => state.login
  );

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: AuthRepository.login,
    onSuccess: async (response) => {
      if (!response.user || !response.token) {
        return;
      }

      await SecureStorageService.saveToken(
        response.token
      );

      login(response.user, response.token);

      router.replace("/(tabs)");
    },
  });
}