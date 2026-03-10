import { Response } from "express";
import { ApiResponse, ApiError } from "../types";

export const sendSuccess = <T>(res: Response, data: T, message = "Success", statusCode = 200, meta?: ApiResponse["meta"]): void => {
  const response: ApiResponse<T> = { success: true, message, data, meta: meta ?? null, errors: null };
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message = "Internal Server Error", statusCode = 500, errors?: ApiError[]): void => {
  const response: ApiResponse = { success: false, message, data: null, errors: errors ?? null };
  res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message = "Created"): void => sendSuccess(res, data, message, 201);

export const sendNotFound = (res: Response, message = "Resource not found"): void => sendError(res, message, 404);

export const sendBadRequest = (res: Response, message = "Bad request", errors?: ApiError[]): void => sendError(res, message, 400, errors);

export const sendUnauthorized = (res: Response, message = "Unauthorized"): void => sendError(res, message, 401);

export const sendForbidden = (res: Response, message = "Forbidden"): void => sendError(res, message, 403);
