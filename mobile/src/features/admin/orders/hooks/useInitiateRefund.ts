import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminOrdersRepository } from "../repositories/adminOrders.repository";

export function useInitiateRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminOrdersRepository.initiateRefund(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "refunds"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "returns"] });
    },
  });
}
