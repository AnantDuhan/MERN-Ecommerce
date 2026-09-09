import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { useAuthStore } from "@/store/auth.store";
import { OrdersRepository } from "../repositories/orders.repository";

export function useMyOrders() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.ALL,
    queryFn: OrdersRepository.mine,
    enabled: isAuthenticated,
  });
}
