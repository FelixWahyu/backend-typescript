import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { catchAsync } from "@/utils/catchAsync";
import { sendSuccess, sendCreated } from "@/utils/response";

export class UserController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await UserService.getUsers({ page, limit });
    sendSuccess(res, result.data, "Get all users successfully.", 200, result.meta);
  });

  static getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const user = await UserService.getUserById(req.params.id);
    sendSuccess(res, user, "Get user by id successfully.");
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.createUser(req.body);
    sendCreated(res, user, "User created successfully.");
  });

  static getEditUser = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const user = await UserService.getUserById(req.params.id);
    sendSuccess(res, user, "Get user for edit successfully.");
  });

  static update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    sendSuccess(res, updatedUser, "User updated successfully.");
  });

  static delete = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    await UserService.deleteUser(req.params.id);
    sendSuccess(res, null, "User deleted successfully.");
  });
}
