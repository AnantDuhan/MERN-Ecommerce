import type { Request, RequestHandler, Response } from "express";
import { asyncHandler, AppError, userFromHeaders } from "@order-planning/shared";
import { Cart } from "../models/cart";
import { generateId } from "../utils/generateId";

/** Ported from controllers/cart.js — server-persisted cart, one per user. */
export function makeCartController() {
  const getCart: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const cart = await Cart.findOne({ user: ctx.id });
    res.status(200).json({ success: true, items: cart?.items ?? [] });
  });

  const syncCart: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const cart = await Cart.findOneAndUpdate(
      { user: ctx.id },
      { $set: { items: req.body.items ?? [], updatedAt: new Date() }, $setOnInsert: { _id: generateId() } },
      { new: true, upsert: true },
    );
    res.status(200).json({ success: true, items: cart.items });
  });

  return { getCart, syncCart };
}
