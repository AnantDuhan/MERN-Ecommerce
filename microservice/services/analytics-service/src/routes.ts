import { Router } from "express";
import { requireRole } from "@order-planning/shared";
import { getSummary, getTimeseries, getTopProducts } from "./controllers/analyticsController";

/** Mounted at /api/v1/analytics — admin only, mirroring the monolith's admin
 *  analytics routes. */
export function buildRouter(): Router {
  const r = Router();
  r.get("/summary", requireRole("admin"), getSummary);
  r.get("/timeseries", requireRole("admin"), getTimeseries);
  r.get("/top-products", requireRole("admin"), getTopProducts);
  return r;
}
