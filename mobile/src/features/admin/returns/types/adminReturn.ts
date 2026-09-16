export interface AdminReturn {
  _id: string;
  order: {
    _id: string;
    totalPrice: number;
    returnRequestedAt?: string;
    user?: { name: string; email: string };
  };
  products: { product: { name: string; price: number }; quantity: number }[];
  reason: string;
  status: string;
  requestedAt: string;
  resolvedAt?: string;
}

export interface AdminReturnsResponse {
  success: boolean;
  returns: AdminReturn[];
}

export const RETURN_STATUSES = ["Pending", "Approved", "Rejected", "Completed"] as const;
