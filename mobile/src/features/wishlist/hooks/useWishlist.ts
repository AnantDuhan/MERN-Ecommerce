import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { useAuthStore } from "@/store/auth.store";
import { WishlistRepository } from "../repositories/wishlist.repository";

export function useWishlist() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: QUERY_KEYS.WISHLIST.ALL,
    queryFn: WishlistRepository.list,
    enabled: isAuthenticated,
  });
}
