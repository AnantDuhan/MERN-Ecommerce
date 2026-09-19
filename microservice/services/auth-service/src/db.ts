import mongoose from "mongoose";
import { createLogger } from "@order-planning/shared";
import { config } from "./config";

const log = createLogger("auth-service");

/** auth-service owns the users database; no other service connects to it. */
export async function connectDB(): Promise<void> {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.mongoUri);
  log.info("mongo connected");
}
