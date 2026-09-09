export interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxOrderAmount: number;
}

export interface CouponsResponse {
  success: boolean;
  coupons: Coupon[];
}
