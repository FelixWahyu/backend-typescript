import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";
import { register, login, refreshToken, logout } from "../services/authService";
import { blacklistToken, cleanupExpiredTokens } from "../services/blacklist.service";
import { AuthRequest } from "../types";

/**
 * POST /auth/register — Mendaftarkan user baru.
 */
export const registerHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await register(req.body);
  sendCreated(res, result, "Register successfully");
});

/**
 * POST /auth/login — Login dengan email & password.
 */
export const loginHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await login(req.body);
  sendSuccess(res, result, "Login successfully");
});

/**
 * POST /auth/refresh-token — Perbarui access token.
 */
export const refreshTokenHandler = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    res.status(400).json({ success: false, message: "Refresh token tidak ditemukan" });
    return;
  }
  const result = await refreshToken(token);
  sendSuccess(res, result, "Token berhasil diperbarui");
});

/**
 * POST /auth/logout — Hapus refresh token.
 */
export const logoutHandler = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (token) await logout(token);

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const accessToken = authHeader.split(" ")[1];
    await blacklistToken(accessToken);
    await cleanupExpiredTokens();
  }

  sendSuccess(res, null, "Logout berhasil");
});

/**
 * GET /auth/me — Ambil data user yang sedang login.
 */
export const getMeHandler = catchAsync(async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user;
  sendSuccess(res, user, "Get current user success");
});
