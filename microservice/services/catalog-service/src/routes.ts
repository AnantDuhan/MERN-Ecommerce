import { Router } from "express";
import { requireUser, requireRole, type EventBus } from "@order-planning/shared";
import { makeProductController } from "./controllers/productController";
import { makeBannerController } from "./controllers/bannerController";

/**
 * Mounted at /api/v1/products (see index.ts). Mirrors the monolith's product +
 * banner routes. Wishlist is intentionally NOT here: it mutates the User
 * document, so it belongs to the user/account domain (auth-service), not
 * catalog — moving it keeps each service's data private to itself.
 */
export function buildRouter(bus: EventBus): Router {
  const p = makeProductController(bus);
  const b = makeBannerController();
  const r = Router();

  // Products
  r.get("/", p.getAllProducts);
  r.get("/detail/:id", p.getProductDetails);
  r.get("/admin/all", requireRole("admin"), p.getAdminProducts);
  r.post("/admin/new", requireRole("admin"), p.createProduct);
  r.put("/admin/:id", requireRole("admin"), p.updateProduct);
  r.delete("/admin/:id", requireRole("admin"), p.deleteProduct);
  r.post("/admin/:id/summarize-reviews", requireRole("admin"), p.summarizeReviews);

  // Reviews
  r.post("/review", requireUser, p.createProductReview);
  r.get("/reviews", p.getProductReviews);
  r.delete("/review/:reviewId", requireUser, p.deleteReview);

  // Banners
  r.get("/banners", b.getActiveBanners);
  r.get("/banners/admin/all", requireRole("admin"), b.getAllBanners);
  r.post("/banners/admin/new", requireRole("admin"), b.createBanner);
  r.put("/banners/admin/:id", requireRole("admin"), b.updateBanner);
  r.delete("/banners/admin/:id", requireRole("admin"), b.deleteBanner);

  return r;
}
