import { Router } from "express";
import { requireUser, requireRole, type EventBus } from "@order-planning/shared";
import { makeOrderController } from "./controllers/orderController";
import { makeCartController } from "./controllers/cartController";
import { makeCouponController } from "./controllers/couponController";

/**
 * Mounted at /api/v1/orders. Returns and refunds (return/refund/reorder models
 * existed in the monolith) are the next handlers to port — reorder is wired;
 * the return/refund request+admin flow is stubbed below so the surface is
 * honest about what's live.
 */
export function buildRouter(bus: EventBus): Router {
  const o = makeOrderController(bus);
  const cart = makeCartController();
  const coupon = makeCouponController();
  const r = Router();

  // Orders
  r.post("/new", requireUser, o.newOrder);
  r.get("/me", requireUser, o.myOrders);
  r.get("/detail/:id", requireUser, o.getSingleOrder);
  r.post("/reorder/:id", requireUser, o.reorder);
  r.get("/admin/all", requireRole("admin"), o.getAllOrders);
  r.put("/admin/:id", requireRole("admin"), o.updateOrder);
  r.delete("/admin/:id", requireRole("admin"), o.deleteOrder);

  // Cart
  r.get("/cart", requireUser, cart.getCart);
  r.put("/cart", requireUser, cart.syncCart);

  // Coupons
  r.post("/coupon/validate", requireUser, coupon.validateCoupon);
  r.post("/coupon/admin/new", requireRole("admin"), coupon.createCoupon);

  // Returns / refunds — to port from controllers/order.js + return/refund models
  const todo = (src: string) => (_req: unknown, res: import("express").Response) =>
    res.status(501).json({ message: `Not yet ported from ${src}` });
  r.post("/return/:id", requireUser, todo("controllers/return.js"));
  r.post("/refund/:id", requireRole("admin"), todo("controllers/refund.js"));

  return r;
}
