import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export class ContactRepository {
  static async send(payload: ContactPayload) {
    const { data } = await api.post(API_ENDPOINTS.CONTACT.SEND, payload);
    return data;
  }
}
