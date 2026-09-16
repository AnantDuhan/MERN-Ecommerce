import { useQuery } from "@tanstack/react-query";
import { AdminProductsRepository } from "../repositories/adminProducts.repository";

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: AdminProductsRepository.list,
  });
}
