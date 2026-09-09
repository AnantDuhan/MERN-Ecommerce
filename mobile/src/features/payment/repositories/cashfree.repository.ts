import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface CreateCashfreeOrderResponse {
  success: boolean;
  orderId: string;
  paymentSessionId: string;
}

export interface VerifyCashfreePaymentResponse {
  success: boolean;
  orderId: string;
  status: string; // e.g. "PAID", "ACTIVE", "EXPIRED"
  paymentId: string;
}

export class CashfreeRepository {
  static async createOrder(
    amount: number,
    phoneNumber?: string
  ): Promise<CreateCashfreeOrderResponse> {
    const { data } = await api.post<CreateCashfreeOrderResponse>(
      API_ENDPOINTS.PAYMENT.CASHFREE_CREATE_ORDER,
      { amount, phoneNumber }
    );
    return data;
  }

  static async verify(orderId: string): Promise<VerifyCashfreePaymentResponse> {
    const { data } = await api.get<VerifyCashfreePaymentResponse>(
      API_ENDPOINTS.PAYMENT.CASHFREE_VERIFY(orderId)
    );
    return data;
  }
}
