import { Request } from "express";

export type ApiError = {
  field?: string;
  message: string;
};

// Extended Request with authenticated user
export type AuthRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: string;
  };
};

// Standard API Response shape
export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiError[] | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } | null;
};
