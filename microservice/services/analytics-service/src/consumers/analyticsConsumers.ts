import {
  EventBus,
  DomainEvent,
  createLogger,
  type EventEnvelope,
} from "@order-planning/shared";
import { DailyMetric, ProductMetric, ProcessedEvent } from "../models/metrics";

const log = createLogger("analytics-service");
const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

/** Exactly-once guard: returns false if this envelope was already handled. */
async function firstTime(envelope: EventEnvelope): Promise<boolean> {
  try {
    await ProcessedEvent.create({ _id: envelope.id });
    return true;
  } catch {
    return false; // duplicate key → already processed
  }
}

export async function startAnalyticsConsumers(bus: EventBus): Promise<void> {
  await bus.subscribe(DomainEvent.OrderPlaced, async (order, envelope) => {
    if (!(await firstTime(envelope))) return;
    const day = dayKey(envelope.emittedAt);
    const units = order.items.reduce((sum, i) => sum + i.qty, 0);

    await DailyMetric.updateOne(
      { _id: day },
      { $inc: { revenue: order.total, orders: 1, units } },
      { upsert: true },
    );
    for (const item of order.items) {
      await ProductMetric.updateOne(
        { _id: item.productId },
        { $set: { name: item.name }, $inc: { units: item.qty, revenue: item.price * item.qty } },
        { upsert: true },
      );
    }
    log.info({ orderId: order.orderId, day }, "order rolled up");
  });

  await bus.subscribe(DomainEvent.UserRegistered, async (_user, envelope) => {
    if (!(await firstTime(envelope))) return;
    await DailyMetric.updateOne(
      { _id: dayKey(envelope.emittedAt) },
      { $inc: { signups: 1 } },
      { upsert: true },
    );
  });

  log.info("analytics consumers subscribed");
}
