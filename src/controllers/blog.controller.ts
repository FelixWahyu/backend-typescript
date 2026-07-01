import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";

export class BlogController {
  static createBlog = catchAsync(async (req: Request, res: Response) => {});
}
