import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { WishlistRepository } from "../repositories/wishlist.repository";

interface ToggleArgs {
  id: string;
  inWishlist: boolean;
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, inWishlist }: ToggleArgs) =>
      inWishlist
        ? WishlistRepository.remove(id)
        : WishlistRepository.add(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
    },
  });
}
