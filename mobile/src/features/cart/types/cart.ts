export interface ApiCartItem {
  product: string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  quantity: number;
}

export interface CartSyncResponse {
  success: boolean;
  items: ApiCartItem[];
  updatedAt: string | null;
}
