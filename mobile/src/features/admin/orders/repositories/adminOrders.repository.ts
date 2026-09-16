import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { AdminOrder, AdminOrdersResponse } from "../types/adminOrder";

export class AdminOrdersRepository {
  static async list(): Promise<{ orders: AdminOrder[]; totalAmount: number }> {
    const { data } = await api.get<AdminOrdersResponse>(API_ENDPOINTS.ADMIN.ORDERS);
    return { orders: data.orders, totalAmount: data.totalAmount };
  }

  static async updateStatus(id: string, status: string) {
    const { data } = await api.put(API_ENDPOINTS.ADMIN.ORDER_UPDATE(id), { status });
    return data;
  }

  static async remove(id: string) {
    await api.delete(API_ENDPOINTS.ADMIN.ORDER_DELETE(id));
  }

  static async initiateRefund(id: string) {
    const { data } = await api.post(API_ENDPOINTS.ADMIN.ORDER_REFUND(id));
    return data;
  }
}
