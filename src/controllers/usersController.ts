import { NextFunction, Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { findAllUsers, createUser, findUserById, updateUserById, deleteUserById } from "../services/userService";

interface UserParams {
  id: string;
}

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await findAllUsers({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    });
    sendSuccess(res, result.data, "Get all data success", 200, result.meta);
  } catch (error) {
    next(error);
  }
};

export const createdUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await createUser(req.body);
    sendCreated(res, user, "User created");
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request<UserParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await findUserById(req.params.id);
    sendSuccess(res, user, "Get user success");
  } catch (error) {
    next(error);
  }
};

export const getEditUser = async (req: Request<UserParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await findUserById(req.params.id);
    sendSuccess(res, user, "Get user for edit success");
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request<UserParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedUser = await updateUserById(req.params.id, req.body);
    sendSuccess(res, updatedUser, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request<UserParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteUserById(req.params.id);
    sendSuccess(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
