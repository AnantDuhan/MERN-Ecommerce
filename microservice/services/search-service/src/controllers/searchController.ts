import type { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "@order-planning/shared";
import { searchProducts, suggestProducts, reindexFromCatalog } from "../searchService";

/** Ported from controllers/search.js (searchProductsController + autocomplete),
 *  plus an admin reindex trigger for backfill. */
export const searchController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query;
  const result = await searchProducts({
    keyword: q.keyword as string,
    category: q.category as string,
    minPrice: q.minPrice != null ? Number(q.minPrice) : undefined,
    maxPrice: q.maxPrice != null ? Number(q.maxPrice) : undefined,
    inStock: q.inStock === "true",
    sort: q.sort as string,
    page: q.page != null ? Number(q.page) : 1,
    limit: q.limit != null ? Number(q.limit) : 12,
  });
  res.status(200).json({ success: true, ...result });
});

export const autocompleteController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const suggestions = await suggestProducts(String(req.query.q ?? ""), Number(req.query.limit) || 6);
  res.status(200).json({ success: true, suggestions });
});

export const reindexController: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  const result = await reindexFromCatalog();
  res.status(200).json({ success: true, ...result });
});
