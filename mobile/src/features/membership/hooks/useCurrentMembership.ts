import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { MembershipRepository } from "../repositories/membership.repository";

export function useCurrentMembership() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["membership", "current"],
    queryFn: MembershipRepository.current,
    enabled: isAuthenticated,
  });
}
