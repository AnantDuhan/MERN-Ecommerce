import type { RequestHandler, Router } from "express";

/** Wrap async handlers so a rejected promise reaches the error middleware. */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/** Standard liveness endpoint every service exposes for compose/k8s probes. */
export const mountHealth = (router: Router, service: string): void => {
  router.get("/health", (_req, res) =>
    res.json({ service, status: "ok", uptime: process.uptime() }),
  );
};
