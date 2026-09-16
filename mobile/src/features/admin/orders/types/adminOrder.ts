export interface AdminOrderItem {
  name: string;
  price: number;
  quantity: number;
  images?: { url: string }[];
  product: string;
}

export interface AdminOrder {
  _id: string;
  user: string;
  orderStatus: string;
  orderItems: AdminOrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentInfo?: { id: string; status: string };
  shippingInfo?: {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
    phoneNumber: number;
  };
  isReturned?: boolean;
  refundStatus?: string;
  createdAt: string;
}

export interface AdminOrdersResponse {
  success: boolean;
  totalAmount: number;
  orders: AdminOrder[];
}

export const ORDER_STATUSES = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;
