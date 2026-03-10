import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../utils/response";

export const getUsers = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    sendSuccess(
      res,
      {
        id: 1,
        name: "Felix",
        email: "felix@gmail.com",
        timestamp: new Date().toISOString(),
      },
      "Gel all data success",
    );
  } catch (error) {
    next(error);
  }
};
