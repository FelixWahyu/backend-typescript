import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";
import { findAllUsers, createUser, findUserById, updateUserById, deleteUserById } from "../services/userService";

/**
 * GET /users — Semua user (pagination).
 */
export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await findAllUsers({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  });
  sendSuccess(res, result.data, "Get all data success", 200, result.meta);
});

/**
 * POST /users — Buat user baru (hanya ADMIN).
 */
export const createUserHandler = catchAsync(async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  sendCreated(res, user, "User created");
});

/**
 * GET /users/:id — Detail user.
 */
export const getUserById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const user = await findUserById(req.params.id);
  sendSuccess(res, user, "Get user success");
});

/**
 * GET /users/:id/edit — Data user untuk form edit.
 */
export const getEditUser = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const user = await findUserById(req.params.id);
  sendSuccess(res, user, "Get user for edit success");
});

/**
 * PUT /users/:id — Update user.
 */
export const updateUser = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const updatedUser = await updateUserById(req.params.id, req.body);
  sendSuccess(res, updatedUser, "User updated successfully");
});

/**
 * DELETE /users/:id — Hapus user (hanya ADMIN).
 */
export const deleteUser = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  await deleteUserById(req.params.id);
  sendSuccess(res, null, "User deleted successfully");
});
