import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { verifyAccessToken } from "../utils/jwt";
import { AuthRequest } from "../types";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Token tidak ditemukan", 401);
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    (req as AuthRequest).user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      next(new AppError("Token expired", 401));
      return;
    }

    if (error instanceof Error && error.name === "JsonWebTokenError") {
      next(new AppError("Token tidak valid", 401));
      return;
    }

    next(error);
  }
};

export const authorize = (...role: string[]) => {
  const roleAuthorize = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;

    if (!user) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    if (!role.includes(user.role)) {
      next(new AppError("Forbidden - Akses tidak diizinkan", 403));
      return;
    }

    next();
  };
  return roleAuthorize;
};
