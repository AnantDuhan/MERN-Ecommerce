export interface AdminStats {
  products: number;
  orders: number;
  users: number;
  returns: number;
  refunds: number;
  outOfStock: number;
  inStock: number;
}

export interface AdminStatsResponse {
  success: boolean;
  stats: AdminStats;
}

export interface AnalyticsSummary {
  revenue: number;
  orders: number;
  units: number;
  discountGiven: number;
  returned: number;
  avgOrderValue: number;
  returnRate: number;
}

export interface RevenuePoint {
  period: string;
  revenue: number;
  orders: number;
}

export interface AdminAnalytics {
  summary: AnalyticsSummary;
  revenueSeries: RevenuePoint[];
}

export interface AdminAnalyticsResponse {
  success: boolean;
  range: string;
  analytics: AdminAnalytics;
}
