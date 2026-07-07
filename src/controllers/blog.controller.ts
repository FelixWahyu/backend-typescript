import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";
import { BlogService } from "../services/blog.service";

export class BlogController {
  static createBlog = catchAsync(async (req: Request, res: Response) => {
    const blog = await BlogService.createBlog(req.body);
    sendCreated(res, blog, "Create blog is successfully.");
  });

  static updateBlog = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const blog = await BlogService.updateBlog(req.params.id, req.body);
    sendSuccess(res, blog, "Blog is updated successfully.");
  });
}
