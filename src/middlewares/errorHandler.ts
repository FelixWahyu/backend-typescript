import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { AppError } from "../utils/appError";
import { env } from "../config/env";
import { Prisma } from "../generated/prisma/client";

// 404 handler - place before errorHandler
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

// Global error handler - place last in middleware chain
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  if (env.isDev()) {
    console.error(err);
  }

  // Custom AppError
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Prisma Client Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = (err.meta?.target as string[]) || [];
        const field = target.join(", ");
        sendError(res, `Nilai untuk field '${field}' sudah digunakan.`, 409);
        return;
      }
      case "P2025": {
        sendError(res, err.message || "Data tidak ditemukan.", 404);
        return;
      }
      default: {
        sendError(res, `Database error: ${err.message}`, 500);
        return;
      }
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, "Validasi database gagal.", 400);
    return;
  }

  // JWT Errors
  if (err.name === "TokenExpiredError") {
    sendError(res, "Token expired", 401);
    return;
  }
  if (err.name === "JsonWebTokenError") {
    sendError(res, "Token tidak valid", 401);
    return;
  }

  // Fallback Error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  sendError(res, message, statusCode);
};
