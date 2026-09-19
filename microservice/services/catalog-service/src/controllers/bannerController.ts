import type { Request, RequestHandler, Response } from "express";
import { asyncHandler, AppError } from "@order-planning/shared";
import { Banner } from "../models/banner";
import { generateId } from "../utils/generateId";

/** Ported from controllers/banner.js. Banners are catalog-owned display content;
 *  they don't feed search, so no events are emitted. */
export function makeBannerController() {
  const getActiveBanners: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
    const banners = await Banner.find({ active: true }).sort({ order: 1 });
    res.status(200).json({ success: true, banners });
  });

  const getAllBanners: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
    const banners = await Banner.find().sort({ order: 1 });
    res.status(200).json({ success: true, banners });
  });

  const createBanner: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const banner = await Banner.create({ ...req.body, _id: generateId() });
    res.status(201).json({ success: true, banner });
  });

  const updateBanner: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) throw new AppError("Banner not found", 404);
    res.status(200).json({ success: true, banner });
  });

  const deleteBanner: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) throw new AppError("Banner not found", 404);
    res.status(200).json({ success: true, message: "Banner deleted" });
  });

  return { getActiveBanners, getAllBanners, createBanner, updateBanner, deleteBanner };
}
