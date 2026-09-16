import { useQuery } from "@tanstack/react-query";
import { AdminUsersRepository } from "../repositories/adminUsers.repository";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: AdminUsersRepository.list,
  });
}
