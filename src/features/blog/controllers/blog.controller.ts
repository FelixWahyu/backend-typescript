import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendSuccess, sendCreated } from "../../../utils/response";
import { BlogService } from "../services/blog.service";

export class BlogController {
  static getAll = catchAsync(async (_req: Request, res: Response) => {
    const blogs = await BlogService.getBlogs();
    sendSuccess(res, blogs, "Get all blog successfully.");
  });

  static getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const blog = await BlogService.getBlogById(req.params.id);
    sendSuccess(res, blog, "Get blog by id successfully.");
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const createdNewBlog = await BlogService.createBlog(req.body);
    sendCreated(res, createdNewBlog, "Create new blog successfully.");
  });

  static getEdit = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const blog = await BlogService.getBlogById(req.params.id);
    sendSuccess(res, blog, "Get blog for edit successfully.");
  });

  static update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const updatedBlog = await BlogService.updateBlog(req.params.id, req.body);
    sendSuccess(res, updatedBlog, "Updated blog successfully.");
  });

  static delete = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    await BlogService.deleteBlog(req.params.id);
    sendSuccess(res, null, "Delete blog successfully.");
  });
}
