import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { ReviewsRepository } from "../repositories/reviews.repository";
import { CreateReviewRequest } from "../types/review";

export function useSubmitReview(productId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewRequest) =>
      ReviewsRepository.create(payload),
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
