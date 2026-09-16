import { useQuery } from "@tanstack/react-query";
import { AdminReturnsRepository } from "../repositories/adminReturns.repository";

export function useAdminReturns() {
  return useQuery({
    queryKey: ["admin", "returns"],
    queryFn: AdminReturnsRepository.list,
  });
}
