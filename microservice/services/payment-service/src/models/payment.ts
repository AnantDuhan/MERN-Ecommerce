import { Schema, model, type Model } from "mongoose";

/** payment-service owns payment records — the monolith tracked payment only
 *  inside order.paymentInfo; giving payments their own store is the cleaner
 *  boundary and lets this service be the source of truth for settlement. */
export interface PaymentDoc {
  _id: string;
  cashfreeOrderId: string;
  user: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED";
  cfPaymentId?: string;
  createdAt: Date;
}

const paymentSchema = new Schema<PaymentDoc, Model<PaymentDoc>>({
  _id: String,
  cashfreeOrderId: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
  cfPaymentId: String,
  createdAt: { type: Date, default: Date.now },
});

export const Payment = model<PaymentDoc, Model<PaymentDoc>>("Payment", paymentSchema);
