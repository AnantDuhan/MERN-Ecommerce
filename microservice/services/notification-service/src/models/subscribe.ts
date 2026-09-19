import { Schema, model } from "mongoose";

/**
 * Ported from the monolith's models/subscribe.js. Newsletter subscriptions are
 * owned by notifications — no other service reads or writes them.
 */
export interface SubscribeDoc {
  email: string;
  unsubscribeToken: string;
  unsubscribedAt: Date | null;
  lastNewsletterSentAt: Date | null;
}

const subscribeSchema = new Schema<SubscribeDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    unsubscribeToken: { type: String, required: true },
    unsubscribedAt: { type: Date, default: null },
    lastNewsletterSentAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Subscribe = model<SubscribeDoc>("Subscribe", subscribeSchema);
