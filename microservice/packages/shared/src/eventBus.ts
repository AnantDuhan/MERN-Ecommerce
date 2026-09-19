import Redis from "ioredis";
import { randomUUID } from "crypto";
import type { EventEnvelope, EventPayloads } from "./events";

/**
 * A thin typed wrapper over Redis pub/sub. Publishing a domain event and
 * subscribing to it are the only two things a service does with the bus, and
 * both are checked against the shared EventPayloads map.
 *
 * Pub/sub is fire-and-forget: a consumer that is down misses the message. When
 * you need at-least-once delivery (order/payment flows), swap the transport
 * here for Redis Streams (XADD / consumer groups) — the public API below stays
 * identical, so no service code changes. That upgrade path is the reason the
 * bus is its own module.
 */
export class EventBus {
  private readonly pub: Redis;
  private readonly sub: Redis;

  constructor(redisUrl: string) {
    this.pub = new Redis(redisUrl);
    this.sub = new Redis(redisUrl);
  }

  async publish<E extends keyof EventPayloads>(
    event: E,
    payload: EventPayloads[E],
  ): Promise<void> {
    const envelope: EventEnvelope<E> = {
      event,
      payload,
      id: randomUUID(),
      emittedAt: new Date().toISOString(),
    };
    await this.pub.publish(String(event), JSON.stringify(envelope));
  }

  async subscribe<E extends keyof EventPayloads>(
    event: E,
    handler: (payload: EventPayloads[E], envelope: EventEnvelope<E>) => Promise<void>,
  ): Promise<void> {
    await this.sub.subscribe(String(event));
    this.sub.on("message", async (channel, raw) => {
      if (channel !== String(event)) return;
      const envelope = JSON.parse(raw) as EventEnvelope<E>;
      await handler(envelope.payload, envelope);
    });
  }

  async close(): Promise<void> {
    await Promise.all([this.pub.quit(), this.sub.quit()]);
  }
}
