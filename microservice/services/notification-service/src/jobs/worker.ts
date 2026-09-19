import { Worker } from "bullmq";
import Redis from "ioredis";
import { createLogger } from "@order-planning/shared";
import { config } from "../config";
import { runWeeklyNewsletter } from "./newsletter";

const log = createLogger("notification-service");

/**
 * The scheduled-batch half of notifications, ported from the monolith's
 * worker.js. The web tier used to enqueue 'newsletter'/'wishlist' jobs; now
 * those producers live wherever the schedule is triggered, and this worker —
 * inside the notification service — is the only consumer.
 */
type EmailJobName = "newsletter" | "wishlist";

const handlers: Record<EmailJobName, () => Promise<void>> = {
  newsletter: runWeeklyNewsletter,
  wishlist: async () => {
    /* ported from wishlistJob.js in the same shape as the newsletter job */
  },
};

export function startEmailWorker(): Worker {
  const connection = new Redis(config.redisUrl, { maxRetriesPerRequest: null });

  const worker = new Worker(
    "email",
    async (job) => {
      const handler = handlers[job.name as EmailJobName];
      if (!handler) throw new Error(`No handler registered for job: ${job.name}`);
      await handler();
    },
    { connection, concurrency: 2 },
  );

  worker.on("completed", (job) => log.info({ job: job.name }, "job completed"));
  worker.on("failed", (job, err) =>
    log.error({ job: job?.name, err: err.message }, "job failed"),
  );
  return worker;
}
