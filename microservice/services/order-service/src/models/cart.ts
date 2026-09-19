import { Schema, model, type Model } from "mongoose";

/** Ported from models/cart.js — one cart per user. */
export interface CartItem {
  product: string; name: string; price: number;
  image?: string; size?: string; quantity: number;
}
export interface CartDoc { _id: string; user: string; items: CartItem[]; updatedAt: Date; }

const cartItemSchema = new Schema<CartItem>(
  {
    product: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    size: String,
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const cartSchema = new Schema<CartDoc, Model<CartDoc>>({
  _id: String,
  user: { type: String, ref: "User", required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

export const Cart = model<CartDoc, Model<CartDoc>>("Cart", cartSchema);
