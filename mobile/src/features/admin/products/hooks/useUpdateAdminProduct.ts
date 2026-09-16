import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { AdminProductsRepository } from "../repositories/adminProducts.repository";
import { ProductFormData } from "../types/adminProduct";

export function useUpdateAdminProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
      images,
    }: {
      id: string;
      values: ProductFormData;
      images?: any[];
    }) => AdminProductsRepository.update(id, values, images),
    onSuccess: (_product, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.DETAIL(variables.id),
      });
    },
  });
}
