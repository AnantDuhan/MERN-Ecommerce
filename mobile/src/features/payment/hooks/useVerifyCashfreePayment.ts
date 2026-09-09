import { useMutation } from "@tanstack/react-query";
import { CashfreeRepository } from "../repositories/cashfree.repository";

export function useVerifyCashfreePayment() {
  return useMutation({
    mutationFn: (orderId: string) => CashfreeRepository.verify(orderId),
  });
}
