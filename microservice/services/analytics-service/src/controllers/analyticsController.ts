import type { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "@order-planning/shared";
import { DailyMetric, ProductMetric } from "../models/metrics";

/** Resolve the inclusive start day (YYYY-MM-DD) for a window like 7d/30d/90d/all. */
function rangeStart(range?: string): string | null {
  const now = new Date();
  const days = range === "7d" ? 7 : range === "90d" ? 90 : range === "all" ? null : 30;
  if (days == null) return null;
  return new Date(now.getTime() - days * 86_400_000).toISOString().slice(0, 10);
}

/** All reads hit the pre-aggregated rollups — no scan of orders anywhere. */
export const getSummary: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = rangeStart(req.query.range as string);
  const match = start ? { _id: { $gte: start } } : {};
  const days = await DailyMetric.find(match);
  const totals = days.reduce(
    (acc, d) => ({
      revenue: acc.revenue + d.revenue,
      orders: acc.orders + d.orders,
      units: acc.units + d.units,
      discount: acc.discount + d.discount,
      signups: acc.signups + d.signups,
    }),
    { revenue: 0, orders: 0, units: 0, discount: 0, signups: 0 },
  );
  res.status(200).json({
    success: true,
    ...totals,
    avgOrderValue: totals.orders ? totals.revenue / totals.orders : 0,
  });
});

export const getTimeseries: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = rangeStart(req.query.range as string);
  const match = start ? { _id: { $gte: start } } : {};
  const series = await DailyMetric.find(match).sort({ _id: 1 });
  res.status(200).json({ success: true, series });
});

export const getTopProducts: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const products = await ProductMetric.find().sort({ units: -1 }).limit(limit);
  res.status(200).json({ success: true, products });
});
