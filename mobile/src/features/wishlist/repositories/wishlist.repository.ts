import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toProductList } from "@/features/products/mappers/product.mapper";
import { Product } from "@/types/product";
import { WishlistMutationResponse, WishlistResponse } from "../types/wishlist";

export class WishlistRepository {
  static async list(): Promise<Product[]> {
    const { data } = await api.get<WishlistResponse>(
      API_ENDPOINTS.WISHLIST.LIST
    );
    // each wishlist entry is favourited by definition
    return toProductList(data.wishlistProducts).map((p) => ({
      ...p,
      favourite: true,
    }));
  }

  static async add(id: string): Promise<WishlistMutationResponse> {
    const { data } = await api.post<WishlistMutationResponse>(
      API_ENDPOINTS.WISHLIST.ITEM(id)
    );
    return data;
  }

  static async remove(id: string): Promise<WishlistMutationResponse> {
    const { data } = await api.delete<WishlistMutationResponse>(
      API_ENDPOINTS.WISHLIST.ITEM(id)
    );
    return data;
  }
}
