import { Schema, model, type Model } from "mongoose";

/** Ported from models/banner.js. */
export interface BannerDoc {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: { url: string | null };
  active: boolean;
  order: number;
  createdAt: Date;
}

const bannerSchema = new Schema<BannerDoc, Model<BannerDoc>>({
  _id: String,
  title: { type: String, required: [true, "Please enter a title"], maxLength: 40 },
  subtitle: { type: String, required: [true, "Please enter a subtitle"], maxLength: 60 },
  description: { type: String, required: [true, "Please enter a description"], maxLength: 140 },
  buttonText: { type: String, default: "Shop Now" },
  image: { url: { type: String, default: null } },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Banner = model<BannerDoc, Model<BannerDoc>>("Banner", bannerSchema);
