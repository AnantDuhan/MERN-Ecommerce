import type { Request } from "express";
import { config } from "../config";

/**
 * Cashfree lives entirely in payment-service. When checkout needs to confirm a
 * payment cleared before creating the order, it asks payment-service rather than
 * calling Cashfree itself — the gateway (and payment provider) integration stays
 * in exactly one place.
 */
export interface PaymentStatus { status: string; paymentId: string; }

export async function verifyPayment(orderId: string, req: Request): Promise<PaymentStatus> {
  const res = await fetch(
    `${config.paymentServiceUrl}/api/v1/payment/verify/${encodeURIComponent(orderId)}`,
    {
      headers: {
        authorization: req.header("authorization") ?? "",
        cookie: req.header("cookie") ?? "",
      },
    },
  );
  if (!res.ok) throw new Error(`payment verification failed: ${res.status}`);
  return (await res.json()) as PaymentStatus;
}
