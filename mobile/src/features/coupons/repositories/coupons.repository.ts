import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Coupon, CouponsResponse } from "../types/coupon";

export class CouponsRepository {
  static async list(): Promise<Coupon[]> {
    const { data } = await api.get<CouponsResponse>(
      API_ENDPOINTS.COUPONS.LIST
    );
    return data.coupons ?? [];
  }
}
