import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { AdminOrdersRepository } from "../repositories/adminOrders.repository";

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      AdminOrdersRepository.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDERS.DETAIL(variables.id),
      });
    },
  });
}
