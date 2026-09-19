import type { Request, RequestHandler, Response } from "express";
import {
  EventBus,
  DomainEvent,
  asyncHandler,
  AppError,
  userFromHeaders,
} from "@order-planning/shared";
import { Order } from "../models/order";
import { Coupon } from "../models/coupon";
import { generateId } from "../utils/generateId";
import { getUser } from "../clients/authClient";
import { verifyPayment } from "../clients/paymentClient";

/**
 * Checkout is the platform's most important write. Ported from newOrder with two
 * boundary changes: Cashfree verification is delegated to payment-service (order
 * never talks to the provider), and the confirmation email/push are no longer
 * sent inline — order emits OrderPlaced and notification-service delivers them.
 * The partial-unique index on paymentInfo.id plus the explicit dedupe check make
 * the write idempotent against double-submits.
 */
export function makeOrderController(bus: EventBus) {
  const newOrder: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);

    const {
      shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice,
      shippingPrice, totalPrice, couponCode,
    } = req.body ?? {};

    // Confirm the payment cleared — via payment-service, not Cashfree directly.
    if (paymentInfo?.provider === "cashfree") {
      if (!paymentInfo.id || !String(paymentInfo.id).startsWith(`order_${ctx.id}_`)) {
        throw new AppError("You cannot use this payment for the order", 403);
      }
      const status = await verifyPayment(paymentInfo.id, req);
      if (status.status !== "PAID") throw new AppError("Payment has not been completed", 402);
      paymentInfo.status = "PAID";
      paymentInfo.id = status.paymentId || paymentInfo.id;
    }

    // Idempotency: never create two orders for one completed payment.
    if (paymentInfo?.id) {
      const existing = await Order.findOne({ "paymentInfo.id": paymentInfo.id }).select("_id");
      if (existing) return res.status(200).json({ success: true, order: existing, deduped: true });
    }

    let finalTotal = totalPrice;
    let discountedAmount = 0;
    const coupon = couponCode ? await Coupon.findOne({ code: couponCode }) : null;
    if (coupon && coupon.discountPercent != null) {
      const withinRange =
        totalPrice >= (coupon.minOrderAmount ?? 0) &&
        totalPrice <= (coupon.maxOrderAmount ?? Number.MAX_SAFE_INTEGER);
      if (withinRange) {
        discountedAmount = (totalPrice * coupon.discountPercent) / 100;
        finalTotal = totalPrice - discountedAmount;
      }
    }

    // orderItems come from the client (name/price/quantity/product/images).
    // TODO(catalog-service): optionally re-fetch canonical images/prices from
    // catalog to guard against tampering, instead of reading Product directly.
    const randomDays = Math.floor(Math.random() * 8);
    const now = new Date();
    const estimatedDeliveryDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + randomDays);

    const order = await Order.create({
      _id: generateId(),
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice: finalTotal,
      paidAt: new Date(),
      user: ctx.id,
      couponUsed: Boolean(coupon),
      couponCode,
      discountedAmount,
      estimatedDeliveryDate,
    });

    // Fill contact details for the confirmation event from auth-service.
    let email = req.body.email as string | undefined;
    try {
      if (!email) email = (await getUser(req)).email;
    } catch {
      /* email stays undefined; notification-service can resolve by userId */
    }

    await bus.publish(DomainEvent.OrderPlaced, {
      orderId: order._id,
      userId: ctx.id,
      email: email ?? "",
      total: finalTotal,
      items: order.orderItems.map((i) => ({
        productId: i.product, name: i.name, qty: i.quantity, price: i.price,
      })),
    });

    res.status(201).json({ success: true, order });
  });

  const getSingleOrder: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError("Order not found", 404);
    res.status(200).json({ success: true, order });
  });

  const myOrders: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const orders = await Order.find({ user: ctx.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  });

  const getAllOrders: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    const totalAmount = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    res.status(200).json({ success: true, orders, totalAmount });
  });

  const updateOrder: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError("Order not found", 404);
    if (order.orderStatus === "Delivered") throw new AppError("Order already delivered", 400);
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") order.DeliveredAt = new Date();
    await order.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
  });

  const deleteOrder: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) throw new AppError("Order not found", 404);
    res.status(200).json({ success: true });
  });

  const reorder: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const previous = await Order.findById(req.params.id);
    if (!previous || previous.user !== ctx.id) throw new AppError("Order not found", 404);
    // Return the previous items so the client can rebuild the cart/checkout.
    res.status(200).json({ success: true, items: previous.orderItems });
  });

  return { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder, reorder };
}
