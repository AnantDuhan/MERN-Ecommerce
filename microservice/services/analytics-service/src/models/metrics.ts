import { Schema, model, type Model } from "mongoose";

/**
 * Rollup collections, not raw data. The monolith computed analytics by scanning
 * the Order collection on every request; this service keeps small pre-aggregated
 * documents updated incrementally as events arrive, so a dashboard read is a
 * couple of indexed lookups instead of a full-collection aggregation — and it
 * never needs to see another service's database.
 */
export interface DailyMetricDoc {
  _id: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
  units: number;
  discount: number;
  signups: number;
}
const dailySchema = new Schema<DailyMetricDoc, Model<DailyMetricDoc>>({
  _id: String,
  revenue: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  units: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  signups: { type: Number, default: 0 },
});
export const DailyMetric = model<DailyMetricDoc, Model<DailyMetricDoc>>("DailyMetric", dailySchema);

export interface ProductMetricDoc {
  _id: string; // productId
  name: string;
  units: number;
  revenue: number;
}
const productSchema = new Schema<ProductMetricDoc, Model<ProductMetricDoc>>({
  _id: String,
  name: String,
  units: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
});
export const ProductMetric = model<ProductMetricDoc, Model<ProductMetricDoc>>("ProductMetric", productSchema);

/**
 * Delivery is at-least-once, so the same event can arrive twice. Recording each
 * processed envelope id (a unique _id) and skipping duplicates turns that into
 * exactly-once processing — the counters above never double-count.
 */
export interface ProcessedEventDoc { _id: string; at: Date; }
const processedSchema = new Schema<ProcessedEventDoc, Model<ProcessedEventDoc>>({
  _id: String,
  at: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
});
export const ProcessedEvent = model<ProcessedEventDoc, Model<ProcessedEventDoc>>("ProcessedEvent", processedSchema);
