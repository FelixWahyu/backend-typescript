import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { catchAsync } from "@/utils/catchAsync";
import { sendSuccess, sendCreated } from "@/utils/response";

export class PostController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const result = await PostService.getPosts({ page, limit, search });
    sendSuccess(res, result.data, "Posts fetched successfully.", 200, result.meta);
  });

  static getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const post = await PostService.getPostById(req.params.id);
    sendSuccess(res, post, "Post fetched successfully.");
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const post = await PostService.createPost(req.body);
    sendCreated(res, post, "Create post is successfully.");
  });

  static getEdit = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const post = await PostService.getPostById(req.params.id);
    sendSuccess(res, post, "Get post for edit successfully.");
  });

  static update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const post = await PostService.updatePost(req.params.id, req.body);
    sendSuccess(res, post, "Post updated successfully.");
  });

  static delete = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    await PostService.deletePost(req.params.id);
    sendSuccess(res, null, "Post deleted successfully.");
  });
}
