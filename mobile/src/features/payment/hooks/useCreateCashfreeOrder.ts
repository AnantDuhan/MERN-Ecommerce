import { useMutation } from "@tanstack/react-query";
import { CashfreeRepository } from "../repositories/cashfree.repository";

export function useCreateCashfreeOrder() {
  return useMutation({
    mutationFn: ({
      amount,
      phoneNumber,
    }: {
      amount: number;
      phoneNumber?: string;
    }) => CashfreeRepository.createOrder(amount, phoneNumber),
  });
}
