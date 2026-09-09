import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { ProductsRepository } from "../repositories/products.repository";

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.DETAIL(id ?? ""),
    queryFn: () => ProductsRepository.detail(id as string),
    enabled: !!id,
  });
}
