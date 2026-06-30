import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";

/**
 * Membungkus async handler agar error otomatis diteruskan ke errorHandler
 * tanpa perlu try-catch manual di setiap controller.
 */
export const catchAsync = <P extends ParamsDictionary = ParamsDictionary>(
  fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request<P>, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
