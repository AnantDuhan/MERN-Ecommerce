import type { Request, RequestHandler, Response } from "express";
import {
  EventBus,
  DomainEvent,
  asyncHandler,
  AppError,
  userFromHeaders,
} from "@order-planning/shared";
import { config } from "../config";
import { Payment } from "../models/payment";
import { generateId } from "../utils/generateId";
import { cashfreeRequest, getCashfreeOrder, verifyWebhookSignature } from "../utils/cashfree";

interface RawBodyRequest extends Request {
  rawBody?: string;
}

/**
 * Ported from controllers/payment.js. This service is the single Cashfree
 * integration point and the source of truth for settlement: it persists a
 * Payment record and emits PaymentSucceeded / PaymentFailed, which order-service
 * consumes to reconcile the order. Emits are idempotent-safe because the
 * consumers are.
 */
export function makePaymentController(bus: EventBus) {
  const createCashfreeOrder: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new AppError("A valid payment amount is required", 400);

    const cashfreeOrderId = `order_${ctx.id}_${generateId()}`;
    // Customer details come from the checkout body — payment-service doesn't own
    // user data, so it doesn't call auth here; the client already collected them.
    const payload: Record<string, unknown> = {
      order_id: cashfreeOrderId,
      order_amount: Number(amount.toFixed(2)),
      order_currency: "INR",
      customer_details: {
        customer_id: ctx.id,
        customer_name: req.body.customerName ?? "Customer",
        customer_email: req.body.customerEmail ?? "",
        customer_phone: String(req.body.phoneNumber ?? "9999999999"),
      },
      order_meta: {
        return_url: `${config.frontendUrl}/payment?cashfree_order_id=${cashfreeOrderId}`,
        ...(config.cashfree.webhookUrl ? { notify_url: config.cashfree.webhookUrl } : {}),
      },
    };

    const cashfreeOrder = await cashfreeRequest<{ order_id: string; payment_session_id: string }>(
      "/orders",
      { method: "POST", body: JSON.stringify(payload) },
    );

    await Payment.create({
      _id: generateId(),
      cashfreeOrderId,
      user: ctx.id,
      amount,
      status: "PENDING",
    });

    res.status(200).json({
      success: true,
      orderId: cashfreeOrder.order_id,
      paymentSessionId: cashfreeOrder.payment_session_id,
    });
  });

  /** Called by order-service (and the client) to confirm settlement. Emits the
   *  matching domain event so the order reconciles even without a webhook. */
  const verifyCashfreePayment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const orderId = String(req.params.orderId);
    if (!orderId.startsWith(`order_${ctx.id}_`)) throw new AppError("You cannot verify this payment", 403);

    const cashfreeOrder = await getCashfreeOrder(orderId);
    const paymentId = cashfreeOrder.cf_order_id ?? orderId;

    if (cashfreeOrder.order_status === "PAID") {
      await Payment.findOneAndUpdate(
        { cashfreeOrderId: orderId },
        { $set: { status: "PAID", cfPaymentId: paymentId } },
      );
      await bus.publish(DomainEvent.PaymentSucceeded, { orderId, paymentId });
    } else if (["EXPIRED", "FAILED", "CANCELLED"].includes(cashfreeOrder.order_status)) {
      await Payment.findOneAndUpdate({ cashfreeOrderId: orderId }, { $set: { status: "FAILED" } });
      await bus.publish(DomainEvent.PaymentFailed, { orderId, reason: cashfreeOrder.order_status });
    }

    res.status(200).json({ success: true, orderId, status: cashfreeOrder.order_status, paymentId });
  });

  /** Cashfree → us. Signature is verified over the raw body before we trust it. */
  const cashfreeWebhook: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const raw = (req as RawBodyRequest).rawBody ?? "";
    const valid = verifyWebhookSignature(
      String(req.header("x-webhook-timestamp") ?? ""),
      raw,
      String(req.header("x-webhook-signature") ?? ""),
    );
    if (!valid) throw new AppError("Invalid webhook signature", 400);

    const body = JSON.parse(raw || "{}") as {
      data?: { order?: { order_id?: string }; payment?: { payment_status?: string; cf_payment_id?: string } };
    };
    const orderId = body.data?.order?.order_id;
    const status = body.data?.payment?.payment_status;
    if (orderId && status === "SUCCESS") {
      const paymentId = body.data?.payment?.cf_payment_id ?? orderId;
      await Payment.findOneAndUpdate(
        { cashfreeOrderId: orderId },
        { $set: { status: "PAID", cfPaymentId: paymentId } },
      );
      await bus.publish(DomainEvent.PaymentSucceeded, { orderId, paymentId });
    } else if (orderId && status === "FAILED") {
      await Payment.findOneAndUpdate({ cashfreeOrderId: orderId }, { $set: { status: "FAILED" } });
      await bus.publish(DomainEvent.PaymentFailed, { orderId, reason: "webhook: FAILED" });
    }

    res.status(200).json({ success: true });
  });

  return { createCashfreeOrder, verifyCashfreePayment, cashfreeWebhook };
}
