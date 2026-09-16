import { useQuery } from "@tanstack/react-query";
import { MembershipRepository } from "../repositories/membership.repository";

export function useMembershipPlans() {
  return useQuery({
    queryKey: ["membership", "plans"],
    queryFn: MembershipRepository.plans,
    staleTime: 5 * 60 * 1000,
  });
}
