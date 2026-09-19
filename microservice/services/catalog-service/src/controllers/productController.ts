import type { Request, RequestHandler, Response } from "express";
import Redis from "ioredis";
import {
  EventBus,
  DomainEvent,
  asyncHandler,
  AppError,
  userFromHeaders,
  createLogger,
} from "@order-planning/shared";
import { config } from "../config";
import { Product, toIndexDoc, type ProductDoc } from "../models/product";
import { ApiFeatures } from "../utils/apiFeatures";
import { generateId } from "../utils/generateId";

const log = createLogger("catalog-service");

/**
 * Every mutation emits the matching Product event so search-service (and any
 * later consumer, e.g. analytics) stays in sync without catalog knowing they
 * exist. Create/Update carry the indexable projection; Delete carries just the
 * id. This is the read side of the CQRS-ish split: writes here, the search
 * read-model over there, reconciled by events.
 */
export function makeProductController(bus: EventBus) {
  const redis = new Redis(config.redisUrl, { lazyConnect: true, maxRetriesPerRequest: null });

  const emitUpserted = (event: DomainEvent.ProductCreated | DomainEvent.ProductUpdated, p: ProductDoc) =>
    bus.publish(event, { productId: p._id, product: toIndexDoc(p) });

  /** Ported from getAllProducts — per-query Redis cache + ApiFeatures. */
  const getAllProducts: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const cacheKey = `products:list:${JSON.stringify(req.query)}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return res.status(200).json(JSON.parse(cached));
    } catch (e) {
      log.error({ err: (e as Error).message }, "cache read failed");
    }

    const productsCount = await Product.countDocuments();
    const features = new ApiFeatures<ProductDoc>(
      Product.find(),
      req.query as Record<string, string | undefined>,
    )
      .search()
      .filter();

    let products = await features.query;
    const filteredProductsCount = products.length;
    features.pagination(config.resultPerPage);
    products = await features.query.clone();

    const payload = {
      success: true,
      products,
      productsCount,
      resultPerPage: config.resultPerPage,
      filteredProductsCount,
    };
    try {
      await redis.set(cacheKey, JSON.stringify(payload), "EX", config.listCacheTtl);
    } catch (e) {
      log.error({ err: (e as Error).message }, "cache write failed");
    }
    res.status(200).json(payload);
  });

  const getProductDetails: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new AppError("Product not found", 404);
    res.status(200).json({ success: true, product });
  });

  const getAdminProducts: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  });

  /** New capability: admin create. The monolith seeded via scripts; here an
   *  explicit create emits ProductCreated so the search index is populated. */
  const createProduct: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const user = userFromHeaders(req);
    if (!user) throw new AppError("Authentication required", 401);
    const product = await Product.create({ ...req.body, _id: generateId(), user: user.id });
    await emitUpserted(DomainEvent.ProductCreated, product.toObject());
    res.status(201).json({ success: true, product });
  });

  const updateProduct: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) throw new AppError("Product not found", 404);
    await emitUpserted(DomainEvent.ProductUpdated, product.toObject());
    res.status(200).json({ success: true, product });
  });

  const deleteProduct: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new AppError("Product not found", 404);
    await bus.publish(DomainEvent.ProductDeleted, { productId: String(req.params.id) });
    res.status(200).json({ success: true, message: "Product deleted" });
  });

  /** Ported from createProductReview: upsert the embedded review, recompute
   *  ratings/numOfReviews, then emit ProductUpdated so search reflects the new
   *  rating. */
  const createProductReview: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const user = userFromHeaders(req);
    if (!user) throw new AppError("Authentication required", 401);
    const { rating, comment, productId, name } = req.body ?? {};
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    const existing = product.reviews.find((r) => r.user === user.id);
    if (existing) {
      existing.rating = Number(rating);
      existing.comment = comment;
    } else {
      product.reviews.push({ _id: generateId(), user: user.id, name, rating: Number(rating), comment });
      product.numOfReviews = product.reviews.length;
    }
    product.ratings =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    await product.save();
    await emitUpserted(DomainEvent.ProductUpdated, product.toObject());
    res.status(200).json({ success: true });
  });

  const getProductReviews: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.query.id as string);
    if (!product) throw new AppError("Product not found", 404);
    res.status(200).json({ success: true, reviews: product.reviews });
  });

  const deleteReview: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.query.productId as string);
    if (!product) throw new AppError("Product not found", 404);
    product.reviews = product.reviews.filter((r) => r._id !== req.params.reviewId);
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;
    await product.save();
    await emitUpserted(DomainEvent.ProductUpdated, product.toObject());
    res.status(200).json({ success: true });
  });

  // Gemini-backed review summariser — its own AI concern, ported next.
  const summarizeReviews: RequestHandler = (_req, res) =>
    res.status(501).json({ message: "Not yet ported from controllers/product.js:summerizeProductReviews" });

  return {
    getAllProducts,
    getProductDetails,
    getAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview,
    summarizeReviews,
  };
}
