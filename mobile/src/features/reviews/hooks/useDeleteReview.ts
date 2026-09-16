import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { ReviewsRepository } from "../repositories/reviews.repository";

export function useDeleteReview(productId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) =>
      ReviewsRepository.remove(reviewId, productId as string),
    onSuccess: () => {
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.REVIEWS.LIST(productId),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PRODUCTS.DETAIL(productId),
        });
      }
    },
  });
}
