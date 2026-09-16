import React, { PropsWithChildren, useEffect } from "react";

import { AuthRepository } from "@/features/auth/repositories/auth.repository";
import { SecureStorageService } from "@/services/secure-storage.service";
import { useAuthStore } from "@/store/auth.store";

export default function AuthProvider({
  children,
}: PropsWithChildren) {
  const initialize = useAuthStore(
    (state) => state.initialize
  );

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token =
          await SecureStorageService.getToken();

        if (!token) {
          initialize(null, null);
          return;
        }

        const response =
          await AuthRepository.me();

        initialize(response.user, token);
      } catch (error) {
        console.error(
          "Auth bootstrap failed:",
          error
        );

        await SecureStorageService.clear();

        initialize(null, null);
      }
    };

    void bootstrap();
  }, [initialize]);

  return <>{children}</>;
}