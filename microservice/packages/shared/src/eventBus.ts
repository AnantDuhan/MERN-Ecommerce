import Redis from "ioredis";
import { randomUUID } from "crypto";
import { hostname } from "os";
import type { EventEnvelope, EventPayloads } from "./events";

const STREAM_PREFIX = "stream:";
const READ_COUNT = 10;
const BLOCK_MS = 5000;
/** Messages pending longer than this (ms) are reclaimed and retried. */
const CLAIM_IDLE_MS = 30_000;

/**
 * Event bus over Redis Streams with consumer groups — at-least-once delivery.
 *
 * The public API (publish / subscribe) is unchanged from the pub/sub version, so
 * no consumer's handler code changed when we swapped transports; that was the
 * point of keeping the bus behind its own module. What you gain over pub/sub: a
 * message published while a consumer is down is NOT lost — it waits in the
 * stream and is delivered when the consumer returns. A handler that throws does
 * not ACK, so the message stays pending and is reclaimed and retried by the
 * reaper. Because delivery is at-least-once, handlers must be idempotent (every
 * envelope carries a stable `id` to dedupe on).
 *
 * One consumer GROUP per service (the `service` arg): every group receives every
 * message once, and multiple instances of the same service share its group, so a
 * message is handled once per service rather than once per pod.
 */
export class EventBus {
  private readonly pub: Redis;
  private readonly group: string;
  private readonly consumer: string;
  private readonly redisUrl: string;
  private readonly loops: Redis[] = [];
  private running = true;

  constructor(redisUrl: string, service?: string) {
    this.redisUrl = redisUrl;
    this.pub = new Redis(redisUrl, { maxRetriesPerRequest: null });
    this.group = service ?? `anon-${randomUUID()}`;
    this.consumer = `${this.group}-${hostname()}-${process.pid}`;
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
    await this.pub.xadd(
      `${STREAM_PREFIX}${String(event)}`,
      "*",
      "envelope",
      JSON.stringify(envelope),
    );
  }

  async subscribe<E extends keyof EventPayloads>(
    event: E,
    handler: (payload: EventPayloads[E], envelope: EventEnvelope<E>) => Promise<void>,
  ): Promise<void> {
    const stream = `${STREAM_PREFIX}${String(event)}`;
    const conn = new Redis(this.redisUrl, { maxRetriesPerRequest: null });
    this.loops.push(conn);

    // Create the group at the stream's tail; MKSTREAM makes the stream if new.
    try {
      await conn.xgroup("CREATE", stream, this.group, "$", "MKSTREAM");
    } catch (err) {
      if (!String((err as Error).message).includes("BUSYGROUP")) throw err;
    }

    const dispatch = async (id: string, fields: string[]): Promise<void> => {
      const idx = fields.indexOf("envelope");
      if (idx === -1) {
        await conn.xack(stream, this.group, id);
        return;
      }
      const envelope = JSON.parse(fields[idx + 1]) as EventEnvelope<E>;
      // A throw here skips the ACK, so the message is retried later.
      await handler(envelope.payload, envelope);
      await conn.xack(stream, this.group, id);
    };

    void this.readLoop(conn, stream, dispatch);
    void this.reapLoop(conn, stream, dispatch);
  }

  /** Continuously deliver new messages to this consumer. */
  private async readLoop(
    conn: Redis,
    stream: string,
    dispatch: (id: string, fields: string[]) => Promise<void>,
  ): Promise<void> {
    while (this.running) {
      try {
        const res = (await conn.xreadgroup(
          "GROUP",
          this.group,
          this.consumer,
          "COUNT",
          READ_COUNT,
          "BLOCK",
          BLOCK_MS,
          "STREAMS",
          stream,
          ">",
        )) as Array<[string, Array<[string, string[]]>]> | null;
        if (!res) continue;
        for (const [, entries] of res) {
          for (const [id, fields] of entries) {
            try {
              await dispatch(id, fields);
            } catch (err) {
              console.error(`[eventBus] handler failed for ${id}:`, (err as Error).message);
            }
          }
        }
      } catch (err) {
        if (this.running) console.error("[eventBus] read loop error:", (err as Error).message);
      }
    }
  }

  /** Reclaim and retry messages a consumer took but never ACKed. */
  private async reapLoop(
    conn: Redis,
    stream: string,
    dispatch: (id: string, fields: string[]) => Promise<void>,
  ): Promise<void> {
    while (this.running) {
      await new Promise((r) => setTimeout(r, CLAIM_IDLE_MS));
      if (!this.running) break;
      try {
        const res = (await conn.xautoclaim(
          stream,
          this.group,
          this.consumer,
          CLAIM_IDLE_MS,
          "0",
          "COUNT",
          READ_COUNT,
        )) as [string, Array<[string, string[]]>, string[]];
        const entries = res?.[1] ?? [];
        for (const [id, fields] of entries) {
          try {
            await dispatch(id, fields);
          } catch (err) {
            console.error(`[eventBus] retry failed for ${id}:`, (err as Error).message);
          }
        }
      } catch (err) {
        if (this.running) console.error("[eventBus] reap loop error:", (err as Error).message);
      }
    }
  }

  async close(): Promise<void> {
    this.running = false;
    await Promise.all([this.pub.quit(), ...this.loops.map((c) => c.quit())]);
  }
}
