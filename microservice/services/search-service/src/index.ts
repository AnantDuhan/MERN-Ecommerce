import express from "express";
import {
  EventBus,
  createLogger,
  mountHealth,
  errorHandler,
} from "@order-planning/shared";
import { config } from "./config";
import { ensureIndex } from "./searchService";
import { startProductConsumers } from "./consumers/productConsumers";
import { buildRouter } from "./routes";

const log = createLogger("search-service");

async function bootstrap(): Promise<void> {
  await ensureIndex();
  const bus = new EventBus(config.redisUrl, "search-service");
  await startProductConsumers(bus);

  const app = express();
  app.use(express.json());
  mountHealth(app, "search-service");
  app.use("/api/v1/search", buildRouter());
  app.use(errorHandler);

  const server = app.listen(config.port, () =>
    log.info({ port: config.port }, "search-service listening"),
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
