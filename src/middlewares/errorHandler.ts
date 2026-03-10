import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { AppError } from "../utils/appError";
import { env } from "../config/env";

// 404 handler - place before errorHandler
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

// Global error handler - place last in middleware chain
export const errorHandler = (err: AppError | Error, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  if (env.isDev()) {
    console.error(err.stack);
  }

  sendError(res, message, statusCode);
};
