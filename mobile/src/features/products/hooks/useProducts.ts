import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { ProductsRepository } from "../repositories/products.repository";
import { ProductsQuery } from "../types/product";

export function useProducts(query: ProductsQuery = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS.ALL, query],
    queryFn: () => ProductsRepository.list(query),
  });
}
