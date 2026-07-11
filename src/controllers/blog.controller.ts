import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";
import { BlogService } from "../services/blog.service";

export class BlogController {
  static getAll = catchAsync(async (_req: Request, res: Response) => {
    const blogs = await BlogService.getAllBlog();
    sendSuccess(res, blogs, "Get all blogs successfully.");
  });

  static getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const blog = await BlogService.getBlogById(req.params.id);
    sendSuccess(res, blog, "Get blog by id successfully.");
  });

  static createBlog = catchAsync(async (req: Request, res: Response) => {
    const blog = await BlogService.createBlog(req.body);
    sendCreated(res, blog, "Create blog is successfully.");
  });

  static updateBlog = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const blog = await BlogService.updateBlog(req.params.id, req.body);
    sendSuccess(res, blog, "Blog is updated successfully.");
  });

  static deleteBlog = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    await BlogService.deleteBlog(req.params.id);
    sendSuccess(res, null, "Deleted blog is successfully.");
  });
}
