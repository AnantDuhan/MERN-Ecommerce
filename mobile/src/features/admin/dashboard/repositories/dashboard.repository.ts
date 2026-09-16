import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  AdminAnalyticsResponse,
  AdminStats,
  AdminStatsResponse,
  AdminAnalytics,
} from "../types/dashboard";

export class DashboardRepository {
  static async stats(): Promise<AdminStats> {
    const { data } = await api.get<AdminStatsResponse>(API_ENDPOINTS.ADMIN.STATS);
    return data.stats;
  }

  static async analytics(range = "30d"): Promise<AdminAnalytics> {
    const { data } = await api.get<AdminAnalyticsResponse>(
      API_ENDPOINTS.ADMIN.ANALYTICS,
      { params: { range } }
    );
    return data.analytics;
  }
}
