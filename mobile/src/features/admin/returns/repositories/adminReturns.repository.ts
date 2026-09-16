import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { AdminReturn, AdminReturnsResponse } from "../types/adminReturn";

export class AdminReturnsRepository {
  static async list(): Promise<AdminReturn[]> {
    const { data } = await api.get<AdminReturnsResponse>(API_ENDPOINTS.ADMIN.RETURNS);
    return data.returns;
  }

  static async updateStatus(id: string, status: string) {
    const { data } = await api.patch(API_ENDPOINTS.ADMIN.RETURN_STATUS(id), { status });
    return data;
  }
}
