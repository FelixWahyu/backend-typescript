import { Request, Response, NextFunction } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { register, login, refreshToken, logout } from "../services/authService";
import { AuthRequest } from "../types";

export const registerHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await register(req.body);
    sendCreated(res, result, "Register successfully");
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authenticate = await login(req.body);
    sendSuccess(res, authenticate, "Login successfully");
  } catch (error) {
    next(error);
  }
};

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) throw new Error("Refresh token tidak ditemukan");

    const result = await refreshToken(token);
    sendSuccess(res, result, "Token berhasil diperbarui");
  } catch (error) {
    next(error);
  }
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    if (token) await logout(token);

    sendSuccess(res, null, "Logout berhasil");
  } catch (error) {
    next(error);
  }
};

export const getMeHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as AuthRequest).user;
    sendSuccess(res, user, "Get current user success");
  } catch (error) {
    next(error);
  }
};
