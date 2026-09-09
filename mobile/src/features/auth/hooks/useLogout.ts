import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { AuthRepository } from "../repositories/auth.repository";
import { SecureStorageService } from "@/services/secure-storage.service";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

export function useLogout() {
  const logout = useAuthStore(
    (state) => state.logout
  );

  return useMutation({
    mutationFn: AuthRepository.logout,

    onSettled: async () => {
      await SecureStorageService.removeToken();

      logout();
      // Prevents this cart from leaking into a different account that
      // logs in on the same device afterwards.
      useCartStore.getState().clear();

      router.replace("/login");
    },
  });
}