import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { OrdersRepository } from "../repositories/orders.repository";

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.DETAIL(id ?? ""),
    queryFn: () => OrdersRepository.detail(id as string),
    enabled: !!id,
  });
}
