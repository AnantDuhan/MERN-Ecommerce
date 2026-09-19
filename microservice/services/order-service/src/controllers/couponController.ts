import type { Request, RequestHandler, Response } from "express";
import { asyncHandler, AppError } from "@order-planning/shared";
import { Coupon } from "../models/coupon";
import { generateId } from "../utils/generateId";

/** Coupons live with orders (they discount an order total). Validate is public
 *  to authed users at checkout; create is admin. */
export function makeCouponController() {
  const validateCoupon: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await Coupon.findOne({ code: req.body.code });
    if (!coupon) throw new AppError("Invalid coupon code", 404);
    if (coupon.expiresAt < new Date()) throw new AppError("Coupon has expired", 400);
    res.status(200).json({ success: true, coupon });
  });

  const createCoupon: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await Coupon.create({ ...req.body, _id: generateId() });
    res.status(201).json({ success: true, coupon });
  });

  return { validateCoupon, createCoupon };
}
