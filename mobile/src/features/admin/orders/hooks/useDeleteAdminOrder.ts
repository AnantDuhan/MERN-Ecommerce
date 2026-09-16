import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminOrdersRepository } from "../repositories/adminOrders.repository";

export function useDeleteAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminOrdersRepository.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}
