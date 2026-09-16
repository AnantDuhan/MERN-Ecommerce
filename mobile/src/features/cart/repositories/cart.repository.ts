import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { CartItem } from "@/store/cart.store";
import { ApiCartItem, CartSyncResponse } from "../types/cart";

function toApiItem(item: CartItem): ApiCartItem {
  const uri = (item.image as any)?.uri as string | undefined;
  return {
    product: item.id,
    name: item.name,
    price: item.price,
    image: uri,
    size: item.size,
    quantity: item.quantity,
  };
}

function toCartItem(item: ApiCartItem): CartItem {
  return {
    id: item.product,
    name: item.name,
    price: item.price,
    image: item.image ? { uri: item.image } : undefined,
    size: item.size,
    quantity: item.quantity,
  };
}

export class CartRepository {
  static async get(): Promise<CartItem[]> {
    const { data } = await api.get<CartSyncResponse>(API_ENDPOINTS.CART.GET);
    return (data.items ?? []).map(toCartItem);
  }

  static async sync(items: CartItem[]): Promise<CartItem[]> {
    const { data } = await api.put<CartSyncResponse>(API_ENDPOINTS.CART.SYNC, {
      items: items.map(toApiItem),
    });
    return (data.items ?? []).map(toCartItem);
  }
}
