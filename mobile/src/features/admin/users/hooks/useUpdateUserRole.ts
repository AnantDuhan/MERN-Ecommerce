import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminUsersRepository } from "../repositories/adminUsers.repository";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name: string; email: string; role: string };
    }) => AdminUsersRepository.updateRole(id, payload),
    onSuccess: (_user, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", variables.id] });
    },
  });
}
