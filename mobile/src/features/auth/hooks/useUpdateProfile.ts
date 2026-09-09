import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import { QUERY_KEYS } from "@/query/queryKeys";
import { AuthRepository } from "../repositories/auth.repository";
import { useAuthStore } from "@/store/auth.store";

interface Payload {
  name: string;
  email: string;
  avatar?: ImagePickerAsset | null;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: Payload) => AuthRepository.updateProfile(payload),
    onSuccess: (response) => {
      if (response.user) {
        setUser(response.user);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me });
    },
  });
}
