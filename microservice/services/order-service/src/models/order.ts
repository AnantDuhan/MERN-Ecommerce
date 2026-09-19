import { Schema, model, type Model } from "mongoose";

/** Ported from models/order.js — structure preserved, including the partial
 *  unique index on paymentInfo.id that dedupes orders per completed payment. */
export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  images: { url: string }[];
  product: string;
}
export interface OrderDoc {
  _id: string;
  shippingInfo: {
    address: string; city: string; state: string; country: string;
    pinCode: number; phoneNumber: number;
  };
  orderItems: OrderItem[];
  user: string;
  paymentInfo: { id: string; status: string };
  paidAt: Date;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: string;
  estimatedDeliveryDate: Date | null;
  DeliveredAt?: Date;
  createdAt: Date;
  isReturned: boolean;
  isRefunded: boolean;
  refundStatus: string;
  couponUsed: boolean;
  couponCode?: string;
  discountedAmount: number;
}

const orderSchema = new Schema<OrderDoc, Model<OrderDoc>>({
  _id: String,
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: Number, required: true },
    phoneNumber: { type: Number, required: true },
  },
  orderItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      images: [{ url: { type: String, required: true } }],
      product: { type: String, ref: "Product", required: true },
    },
  ],
  user: { type: String, ref: "User", required: true },
  paymentInfo: { id: { type: String, required: true }, status: { type: String, required: true } },
  paidAt: { type: Date, required: true },
  itemsPrice: { type: Number, default: 0, required: true },
  taxPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0, required: true },
  totalPrice: { type: Number, default: 0, required: true },
  orderStatus: { type: String, required: true, default: "Processing" },
  estimatedDeliveryDate: { type: Date, default: null },
  DeliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
  isReturned: { type: Boolean, default: false },
  isRefunded: { type: Boolean, default: false },
  refundStatus: { type: String, default: "Not Requested" },
  couponUsed: { type: Boolean, default: false },
  couponCode: String,
  discountedAmount: { type: Number, default: 0 },
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index(
  { "paymentInfo.id": 1 },
  { unique: true, partialFilterExpression: { "paymentInfo.id": { $type: "string" } } },
);

export const Order = model<OrderDoc, Model<OrderDoc>>("Order", orderSchema);
