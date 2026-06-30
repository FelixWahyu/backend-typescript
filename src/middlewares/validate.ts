import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendError } from "../utils/response";
import { ApiError } from "../types";

/**
 * Middleware untuk memvalidasi request body menggunakan Zod schema.
 * Mengembalikan error 400 dengan detail field yang gagal validasi.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors: ApiError[] = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      sendError(res, "Validasi gagal", 400, errors);
      return;
    }

    req.body = result.data;
    next();
  };
};
