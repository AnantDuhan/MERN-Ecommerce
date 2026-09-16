import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export class NewsletterRepository {
  static async subscribe(email: string) {
    const { data } = await api.post(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, {
      email,
    });
    return data;
  }
}
