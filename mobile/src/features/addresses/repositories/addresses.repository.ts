import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Address, AddressesResponse, NewAddress } from "../types/address";

export class AddressesRepository {
  static async list(): Promise<Address[]> {
    const { data } = await api.get<AddressesResponse>(
      API_ENDPOINTS.ADDRESSES.LIST
    );
    return data.addresses ?? [];
  }

  static async add(payload: NewAddress): Promise<Address[]> {
    const { data } = await api.post<AddressesResponse>(
      API_ENDPOINTS.ADDRESSES.CREATE,
      payload
    );
    return data.addresses ?? [];
  }

  static async remove(id: string): Promise<Address[]> {
    const { data } = await api.delete<AddressesResponse>(
      API_ENDPOINTS.ADDRESSES.DELETE(id)
    );
    return data.addresses ?? [];
  }
}
