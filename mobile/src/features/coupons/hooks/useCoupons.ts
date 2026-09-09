import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { CouponsRepository } from "../repositories/coupons.repository";

export function useCoupons() {
  return useQuery({
    queryKey: QUERY_KEYS.COUPONS.ALL,
    queryFn: CouponsRepository.list,
    staleTime: 5 * 60 * 1000,
  });
}
