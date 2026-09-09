import { ApiProduct } from "@/features/products/types/product";

export interface WishlistResponse {
  success: boolean;
  wishlistProducts: ApiProduct[];
}

export interface WishlistMutationResponse {
  success: boolean;
  message: string;
}
