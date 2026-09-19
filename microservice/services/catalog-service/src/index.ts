import express from "express";
import {
  EventBus,
  createLogger,
  mountHealth,
  errorHandler,
} from "@order-planning/shared";
import { config } from "./config";
import { connectDB } from "./db";
import { buildRouter } from "./routes";

const log = createLogger("catalog-service");

async function bootstrap(): Promise<void> {
  await connectDB();
  const bus = new EventBus(config.redisUrl);

  const app = express();
  app.use(express.json({ limit: "10mb" }));
  mountHealth(app, "catalog-service");
  app.use("/api/v1/products", buildRouter(bus));
  app.use(errorHandler);

  const server = app.listen(config.port, () =>
    log.info({ port: config.port }, "catalog-service listening"),
  );

  const shutdown = async (signal: string): Promise<void> => {
    log.info({ signal }, "shutting down");
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
