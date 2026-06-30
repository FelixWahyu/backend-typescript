import { Request, Response } from "express";
import { sendSuccess } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";

/**
 * GET /health — Cek status server.
 */
export const healthCheck = catchAsync(async (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
