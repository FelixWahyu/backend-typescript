import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "@/utils/response";
import { catchAsync } from "@/utils/catchAsync";
import { AuthService } from "../services/auth.service";
import { BlacklistService } from "../services/blacklist.service";
import { AuthRequest } from "@/types";

export class AuthController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    sendCreated(res, result, "Register successfully");
  });

  static login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    sendSuccess(res, result, "Login successfully");
  });

  static refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken: token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, message: "Refresh token tidak ditemukan" });
      return;
    }
    const result = await AuthService.refreshToken(token);
    sendSuccess(res, result, "Token berhasil diperbarui");
  });

  static logout = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken: token } = req.body;
    if (token) await AuthService.logout(token);

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const accessToken = authHeader.split(" ")[1];
      await BlacklistService.blacklistToken(accessToken);
      await BlacklistService.cleanupExpiredTokens();
    }

    sendSuccess(res, null, "Logout berhasil");
  });

  static getMe = catchAsync(async (req: Request, res: Response) => {
    const user = (req as AuthRequest).user;
    sendSuccess(res, user, "Get current user success");
  });
}
