import express from "express";
import { EventBus, createLogger, mountHealth, errorHandler } from "@order-planning/shared";
import { config } from "./config";
import { connectDB } from "./db";
import { buildRouter } from "./routes";
import { startAnalyticsConsumers } from "./consumers/analyticsConsumers";

const log = createLogger("analytics-service");

async function bootstrap(): Promise<void> {
  await connectDB();
  const bus = new EventBus(config.redisUrl, "analytics-service");
  await startAnalyticsConsumers(bus);

  const app = express();
  app.use(express.json());
  mountHealth(app, "analytics-service");
  app.use("/api/v1/analytics", buildRouter());
  app.use(errorHandler);

  const server = app.listen(config.port, () => log.info({ port: config.port }, "analytics-service listening"));
  const shutdown = async (signal: string): Promise<void> => {
    log.info({ signal }, "shutting down");
    await bus.close();
    server.close();
    process.exit(0);
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => { log.error({ err: err.message }, "failed to start"); process.exit(1); });
