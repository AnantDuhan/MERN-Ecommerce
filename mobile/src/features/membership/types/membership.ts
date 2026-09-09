export type PlanInterval = "monthly" | "yearly";

export interface MembershipPlan {
  interval: PlanInterval;
  planId: string;
  name: string;
  amount: number;
  duration: number;
  existsInCashfree: boolean;
}

export interface PlansResponse {
  success: boolean;
  plans: MembershipPlan[];
}

export interface Membership {
  _id: string;
  subscriptionId: string;
  subscriptionSessionId?: string;
  planId: string;
  name: string;
  description: string;
  amount: number;
  duration: number;
  isActive: boolean;
  status: string;
  nextPaymentDate?: string;
  activatedAt?: string;
  createdAt: string;
}

export interface MembershipResponse {
  success: boolean;
  membership: Membership | null;
}

export interface CreateMembershipResponse {
  success: boolean;
  subscriptionId: string;
  subscriptionSessionId: string;
}
