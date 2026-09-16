export interface AdminRefund {
  _id: string;
  order: {
    _id: string;
    totalPrice: number;
    refundRequestedAt?: string;
    user?: { name: string; email: string };
  };
  amount: number;
  status: string;
  initiatedAt: string;
  completedAt?: string;
}

export interface AdminRefundsResponse {
  success: boolean;
  refunds: AdminRefund[];
}

export const REFUND_STATUSES = [
  "Initiated",
  "Pending",
  "Approved",
  "Rejected",
  "Refunded",
] as const;
