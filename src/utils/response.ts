import { Response } from "express";
import { ApiResponse } from "../types";

export const sendSuccess = <T>(res: Response, data: T, message = "Success", statusCode = 200): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, message = "Internal Server Error", statusCode = 500, error?: string): Response => {
  const response: ApiResponse = { success: false, message, error };
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message = "Created"): Response => sendSuccess(res, data, message, 201);

export const sendNotFound = (res: Response, message = "Resource not found"): Response => sendError(res, message, 404);

export const sendBadRequest = (res: Response, message = "Bad request", error?: string): Response => sendError(res, message, 400, error);

export const sendUnauthorized = (res: Response, message = "Unauthorized"): Response => sendError(res, message, 401);

export const sendForbidden = (res: Response, message = "Forbidden"): Response => sendError(res, message, 403);
