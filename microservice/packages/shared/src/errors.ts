import type { ErrorRequestHandler } from "express";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** Terminal error middleware — mount last in every service's Express app. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = status === 500 ? "Internal server error" : err.message;
  res.status(status).json({ success: false, message });
};
