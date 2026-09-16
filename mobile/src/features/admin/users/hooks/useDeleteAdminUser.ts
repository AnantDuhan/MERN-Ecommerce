import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminUsersRepository } from "../repositories/adminUsers.repository";

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminUsersRepository.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
