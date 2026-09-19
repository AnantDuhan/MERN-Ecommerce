import express from "express";
import { EventBus, createLogger, mountHealth, errorHandler } from "@order-planning/shared";
import { config } from "./config";
import { connectDB } from "./db";
import { buildRouter } from "./routes";

const log = createLogger("payment-service");

async function bootstrap(): Promise<void> {
  await connectDB();
  const bus = new EventBus(config.redisUrl, "payment-service");

  const app = express();
  // Capture the raw body so the webhook signature can be verified over exactly
  // the bytes Cashfree signed, while still parsing JSON for every route.
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as express.Request & { rawBody?: string }).rawBody = buf.toString();
      },
    }),
  );
  mountHealth(app, "payment-service");
  app.use("/api/v1/payment", buildRouter(bus));
  app.use(errorHandler);

  const server = app.listen(config.port, () => log.info({ port: config.port }, "payment-service listening"));
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
