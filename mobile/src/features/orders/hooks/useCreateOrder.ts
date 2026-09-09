import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { QUERY_KEYS } from "@/query/queryKeys";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { OrdersRepository } from "../repositories/orders.repository";
import { CreateOrderRequest } from "../types/order";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((s) => s.clear);
  const resetCheckout = useCheckoutStore((s) => s.reset);

  return useMutation({
    mutationFn: (payload: CreateOrderRequest) =>
      OrdersRepository.create(payload),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
      clearCart();
      resetCheckout();
      router.replace({
        pathname: "/checkout/success",
        params: { id: order.id },
      });
    },
  });
}
