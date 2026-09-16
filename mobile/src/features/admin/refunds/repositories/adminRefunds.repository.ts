import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { AdminRefund, AdminRefundsResponse } from "../types/adminRefund";

export class AdminRefundsRepository {
  static async list(): Promise<AdminRefund[]> {
    const { data } = await api.get<AdminRefundsResponse>(API_ENDPOINTS.ADMIN.REFUNDS);
    return data.refunds;
  }

  static async updateStatus(orderId: string, refundId: string, refundStatus: string) {
    const { data } = await api.patch(
      API_ENDPOINTS.ADMIN.REFUND_STATUS(orderId, refundId),
      { refundStatus }
    );
    return data;
  }
}
