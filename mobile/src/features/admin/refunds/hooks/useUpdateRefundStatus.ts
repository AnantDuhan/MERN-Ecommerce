import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminRefundsRepository } from "../repositories/adminRefunds.repository";

export function useUpdateRefundStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      refundId,
      refundStatus,
    }: {
      orderId: string;
      refundId: string;
      refundStatus: string;
    }) => AdminRefundsRepository.updateStatus(orderId, refundId, refundStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "refunds"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}
