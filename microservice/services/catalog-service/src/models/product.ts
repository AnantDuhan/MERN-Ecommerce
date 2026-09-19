import { Schema, model, type Model } from "mongoose";
import type { ProductIndexDoc } from "@order-planning/shared";

/**
 * Ported from the monolith's models/product.js. Reviews stay embedded, the
 * Gemini vector `embedding` stays `select: false`, and the same hot-path indexes
 * are declared. toIndexDoc() below produces exactly the projection
 * search-service indexes, so the event payload and the ES mapping never drift.
 */
export interface ProductImage {
  _id: string;
  url: string;
}
export interface ProductReview {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
}
export interface ProductDoc {
  _id: string;
  name: string;
  description: string;
  price: number;
  ratings: number;
  images: ProductImage[];
  user: string;
  category: string;
  Stock: number;
  numOfReviews: number;
  reviews: ProductReview[];
  createdAt: Date;
  embedding?: number[];
}

const productSchema = new Schema<ProductDoc, Model<ProductDoc>>({
  _id: String,
  name: { type: String, required: [true, "Please Enter product Name"], trim: true },
  description: { type: String, required: [true, "Please Enter product description"] },
  price: {
    type: Number,
    required: [true, "Please Enter product price"],
    maxLength: [6, "Price can't exceed 8 figures"],
  },
  ratings: { type: Number, default: 0 },
  images: [{ _id: String, url: { type: String, required: true } }],
  user: { type: String, ref: "User", required: true },
  category: { type: String, required: [true, "Please Enter product category"] },
  Stock: { type: Number, required: [true, "Please Enter product stock"] },
  numOfReviews: { type: Number, default: 0 },
  reviews: [
    {
      _id: String,
      user: { type: String, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  embedding: { type: [Number], select: false },
});

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ ratings: -1 });
productSchema.index({ name: "text", description: "text" });

export const Product = model<ProductDoc, Model<ProductDoc>>("Product", productSchema);

/** The searchable projection carried on Product events. Mirrors monolith toDoc(). */
export function toIndexDoc(p: ProductDoc): ProductIndexDoc {
  return {
    name: p.name,
    description: p.description,
    category: p.category,
    price: p.price,
    ratings: p.ratings,
    numOfReviews: p.numOfReviews,
    Stock: p.Stock,
    images: p.images,
    createdAt: p.createdAt,
  };
}
