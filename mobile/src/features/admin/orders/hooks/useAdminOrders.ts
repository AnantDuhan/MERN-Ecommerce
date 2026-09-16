import { useQuery } from "@tanstack/react-query";
import { AdminOrdersRepository } from "../repositories/adminOrders.repository";

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: AdminOrdersRepository.list,
  });
}
