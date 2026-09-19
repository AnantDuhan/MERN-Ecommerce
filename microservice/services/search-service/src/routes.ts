import { Router } from "express";
import { requireRole } from "@order-planning/shared";
import { searchController, autocompleteController, reindexController } from "./controllers/searchController";

/** Mounted at /api/v1/search. */
export function buildRouter(): Router {
  const r = Router();
  r.get("/", searchController);
  r.get("/autocomplete", autocompleteController);
  r.post("/admin/reindex", requireRole("admin"), reindexController);
  return r;
}
