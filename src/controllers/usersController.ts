import { NextFunction, Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { findAllUsers, createUser } from "../services/userService";

export const getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await findAllUsers();
    sendSuccess(res, result, "Gel all data success");
  } catch (error) {
    next(error);
  }
};

export const createDataUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await createUser(req.body);
    sendCreated(res, user, "User created");
  } catch (err) {
    next(err);
  }
};
