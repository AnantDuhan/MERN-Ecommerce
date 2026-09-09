export interface ShippingInfoPayload {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  phoneNumber: number;
}

export interface OrderItemPayload {
  name: string;
  price: number;
  quantity: number;
  images: { url: string }[];
  product: string;
}

export interface CreateOrderRequest {
  shippingInfo: ShippingInfoPayload;
  orderItems: OrderItemPayload[];
  paymentInfo: { id: string; status: string };
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

export interface ApiOrder {
  _id: string;
  orderStatus: string;
  createdAt: string;
  paidAt?: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentInfo?: { id: string; status: string };
  shippingInfo?: ShippingInfoPayload;
  orderItems: {
    name: string;
    price: number;
    quantity: number;
    images?: { url: string }[];
    product: string;
  }[];
}

export interface CreateOrderResponse {
  success: boolean;
  order: ApiOrder;
}

export interface MyOrdersResponse {
  success: boolean;
  orders: ApiOrder[];
}

export interface OrderResponse {
  success: boolean;
  order: ApiOrder;
}

/** View-model the UI renders. */
export interface OrderVM {
  id: string;
  status: string;
  createdAt: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  itemCount: number;
  shippingInfo?: ShippingInfoPayload;
  items: {
    name: string;
    price: number;
    quantity: number;
    image?: { uri: string };
    product: string;
  }[];
}
