import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";
import { BlogService } from "../services/blog.service";

export class BlogController {
  static createBlog = catchAsync(async (req: Request, res: Response) => {
    const blog = await BlogService.createBlog(req.body);
    sendCreated(res, blog, "Create blog is successfully.");
  });
}
