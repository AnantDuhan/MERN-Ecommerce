import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ApiBanner, BannerVM, BannersResponse } from "../types/banner";

function toBanner(api: ApiBanner): BannerVM {
  return {
    id: api._id,
    title: api.title,
    subtitle: api.subtitle,
    description: api.description,
    buttonText: api.buttonText || "Shop Now",
    imageUrl: api.image?.url ?? null,
  };
}

export class BannersRepository {
  static async list(): Promise<BannerVM[]> {
    const { data } = await api.get<BannersResponse>(API_ENDPOINTS.BANNERS.LIST);
    return (data.banners ?? []).map(toBanner);
  }
}
