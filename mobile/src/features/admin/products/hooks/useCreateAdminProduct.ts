import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { AdminProductsRepository } from "../repositories/adminProducts.repository";
import { ProductFormData } from "../types/adminProduct";

export function useCreateAdminProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ values, images }: { values: ProductFormData; images: any[] }) =>
      AdminProductsRepository.create(values, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      // Shares the storefront's product list cache key so a newly created
      // product also shows up there without a manual refetch.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
  });
}
