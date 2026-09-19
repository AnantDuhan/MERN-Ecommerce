import { EventBus, DomainEvent, createLogger } from "@order-planning/shared";
import { Order } from "../models/order";

const log = createLogger("order-service");

/**
 * The other side of the payment/order relationship: if a PaymentSucceeded
 * arrives out of band (e.g. a Cashfree webhook confirming a payment after the
 * fact), reconcile the order's paymentInfo. Idempotent — running twice sets the
 * same status — which matters because stream delivery is at-least-once.
 */
export async function startPaymentConsumers(bus: EventBus): Promise<void> {
  await bus.subscribe(DomainEvent.PaymentSucceeded, async ({ orderId, paymentId }) => {
    const updated = await Order.findOneAndUpdate(
      { "paymentInfo.id": orderId },
      { $set: { "paymentInfo.status": "PAID", "paymentInfo.id": paymentId } },
    );
    if (updated) log.info({ orderId, paymentId }, "order reconciled to PAID");
  });

  await bus.subscribe(DomainEvent.PaymentFailed, async ({ orderId, reason }) => {
    await Order.findOneAndUpdate(
      { "paymentInfo.id": orderId },
      { $set: { "paymentInfo.status": "FAILED" } },
    );
    log.warn({ orderId, reason }, "payment failed for order");
  });

  log.info("payment consumers subscribed");
}
