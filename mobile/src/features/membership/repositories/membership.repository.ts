import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  CreateMembershipResponse,
  Membership,
  MembershipResponse,
  PlanInterval,
  PlansResponse,
} from "../types/membership";

export class MembershipRepository {
  static async plans() {
    const { data } = await api.get<PlansResponse>(API_ENDPOINTS.MEMBERSHIP.PLANS);
    return data.plans;
  }

  static async current(): Promise<Membership | null> {
    const { data } = await api.get<MembershipResponse>(API_ENDPOINTS.MEMBERSHIP.CURRENT);
    return data.membership;
  }

  static async create(interval: PlanInterval) {
    const { data } = await api.post<CreateMembershipResponse>(
      API_ENDPOINTS.MEMBERSHIP.CREATE,
      { interval }
    );
    return data;
  }

  static async status(subscriptionId: string): Promise<Membership | null> {
    const { data } = await api.get<MembershipResponse>(
      API_ENDPOINTS.MEMBERSHIP.STATUS(subscriptionId)
    );
    return data.membership;
  }

  static async cancel(subscriptionId: string): Promise<Membership | null> {
    const { data } = await api.post<MembershipResponse>(
      API_ENDPOINTS.MEMBERSHIP.CANCEL(subscriptionId)
    );
    return data.membership;
  }
}
