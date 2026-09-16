import { useQuery } from "@tanstack/react-query";
import { AdminUsersRepository } from "../repositories/adminUsers.repository";

export function useAdminUser(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => AdminUsersRepository.detail(id as string),
    enabled: !!id,
  });
}
