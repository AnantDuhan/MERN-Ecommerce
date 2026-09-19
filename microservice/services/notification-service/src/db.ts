import mongoose from "mongoose";
import { createLogger } from "@order-planning/shared";
import { config } from "./config";

const log = createLogger("notification-service");

/**
 * The service owns its own database. This is the core microservices rule: no
 * other service touches this connection, and this service touches no other
 * service's data. Cross-service reads happen over events or the gateway, never
 * a shared Mongo handle.
 */
export async function connectDB(): Promise<void> {
  await mongoose.connect(config.mongoUri);
  log.info("mongo connected");
}
