import mongoose from "mongoose";
import { createLogger } from "@order-planning/shared";
import { config } from "./config";
const log = createLogger("payment-service");
/** payment-service owns the payments database. */
export async function connectDB(): Promise<void> {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.mongoUri);
  log.info("mongo connected");
}
