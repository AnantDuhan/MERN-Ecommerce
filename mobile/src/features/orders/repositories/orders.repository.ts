import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toOrder } from "../mappers/order.mapper";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  MyOrdersResponse,
  OrderResponse,
  OrderVM,
} from "../types/order";

export class OrdersRepository {
  static async create(payload: CreateOrderRequest): Promise<OrderVM> {
    const { data } = await api.post<CreateOrderResponse>(
      API_ENDPOINTS.ORDERS.CREATE,
      payload
    );
    return toOrder(data.order);
  }

  static async mine(): Promise<OrderVM[]> {
    const { data } = await api.get<MyOrdersResponse>(API_ENDPOINTS.ORDERS.MINE);
    return (data.orders ?? []).map(toOrder);
  }

  static async detail(id: string): Promise<OrderVM> {
    const { data } = await api.get<OrderResponse>(
      API_ENDPOINTS.ORDERS.DETAIL(id)
    );
    return toOrder(data.order);
  }
}
