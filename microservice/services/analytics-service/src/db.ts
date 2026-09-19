import mongoose from "mongoose";
import { createLogger } from "@order-planning/shared";
import { config } from "./config";
const log = createLogger("analytics-service");
/** analytics-service owns only its rollups — never other services' data. */
export async function connectDB(): Promise<void> {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.mongoUri);
  log.info("mongo connected");
}
