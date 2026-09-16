import { useQuery } from "@tanstack/react-query";
import { DashboardRepository } from "../repositories/dashboard.repository";

export function useAdminAnalytics(range = "30d") {
  return useQuery({
    queryKey: ["admin", "analytics", range],
    queryFn: () => DashboardRepository.analytics(range),
  });
}
