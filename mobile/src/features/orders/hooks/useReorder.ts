import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { QUERY_KEYS } from "@/query/queryKeys";
import { OrdersRepository } from "../repositories/orders.repository";

export function useReorder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => OrdersRepository.reorder(id),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
      router.push({ pathname: "/orders/[id]", params: { id: newOrder.id } });
    },
  });
}
