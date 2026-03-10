import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../utils/response";
import { allUsers } from "../services/userService";

export const getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await allUsers();
    sendSuccess(res, result, "Gel all data success");
  } catch (error) {
    next(error);
  }
};
