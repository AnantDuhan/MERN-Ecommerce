import { useQuery } from "@tanstack/react-query";
import { AuthRepository } from "../repositories/auth.repository";
import { QUERY_KEYS } from "@/query/queryKeys";

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: AuthRepository.getCurrentUser,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}