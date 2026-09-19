import { Schema, model, type Model } from "mongoose";

/** Ported from models/coupon.js. */
export interface CouponDoc {
  _id: string; code: string; discount: number; expiresAt: Date; createdAt: Date;
  minOrderAmount?: number; maxOrderAmount?: number; discountPercent?: number;
}

const couponSchema = new Schema<CouponDoc, Model<CouponDoc>>({
  _id: String,
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  minOrderAmount: Number,
  maxOrderAmount: Number,
  discountPercent: Number,
});

export const Coupon = model<CouponDoc, Model<CouponDoc>>("Coupon", couponSchema);
