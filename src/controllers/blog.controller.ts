import { Request, Response, NextFunction } from "express";
import { sendSuccess, sendCreated } from "../utils/response";

export class BlogController {
  static async createBlog(req: Request, res: Response, next: NextFunction) {}
}
