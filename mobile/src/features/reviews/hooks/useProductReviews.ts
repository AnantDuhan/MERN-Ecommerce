import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { ReviewsRepository } from "../repositories/reviews.repository";

export function useProductReviews(productId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.REVIEWS.LIST(productId ?? ""),
    queryFn: () => ReviewsRepository.list(productId as string),
    enabled: !!productId,
  });
}
