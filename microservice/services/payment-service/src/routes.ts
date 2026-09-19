import { Router } from "express";
import { requireUser, type EventBus } from "@order-planning/shared";
import { makePaymentController } from "./controllers/paymentController";

/** Mounted at /api/v1/payment. The webhook is unauthenticated (Cashfree calls
 *  it) but signature-verified inside the handler. */
export function buildRouter(bus: EventBus): Router {
  const c = makePaymentController(bus);
  const r = Router();
  r.post("/cashfree/order", requireUser, c.createCashfreeOrder);
  r.get("/verify/:orderId", requireUser, c.verifyCashfreePayment);
  r.post("/cashfree/webhook", c.cashfreeWebhook);
  return r;
}
