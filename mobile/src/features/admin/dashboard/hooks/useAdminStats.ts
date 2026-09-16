import { useQuery } from "@tanstack/react-query";
import { DashboardRepository } from "../repositories/dashboard.repository";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: DashboardRepository.stats,
  });
}
