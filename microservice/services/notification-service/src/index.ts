import express from "express";
import {
  EventBus,
  createLogger,
  mountHealth,
  errorHandler,
} from "@order-planning/shared";
import { config } from "./config";
import { connectDB } from "./db";
import { startEventConsumers } from "./consumers/eventConsumers";
import { startEmailWorker } from "./jobs/worker";

const log = createLogger("notification-service");

async function bootstrap(): Promise<void> {
  await connectDB();

  const bus = new EventBus(config.redisUrl);
  await startEventConsumers(bus);
  const worker = startEmailWorker();

  const app = express();
  mountHealth(app, "notification-service");
  app.use(errorHandler);
  const server = app.listen(config.port, () =>
    log.info({ port: config.port }, "notification-service listening"),
  );

  const shutdown = async (signal: string): Promise<void> => {
    log.info({ signal }, "shutting down");
    await worker.close();
    await bus.close();
    server.close();
    process.exit(0);
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  log.error({ err: err.message }, "failed to start");
  process.exit(1);
});
