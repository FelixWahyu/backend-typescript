import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";
import { findAllPost, findPostById, createPost, updatePostById, deletePost } from "../services/postService";

export class PostController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const result = await findAllPost(req.query);
    sendSuccess(res, result.data, "Posts fetched successfully.", 200, result.meta);
  });

  static getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const post = await findPostById(req.params.id);
    sendSuccess(res, post, "Post fetched successfully.");
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const post = await createPost(req.body);
    sendCreated(res, post, "Create post is successfully.");
  });

  static update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const post = await updatePostById(req.params.id, req.body);
    sendSuccess(res, post, "Post updated successfully.");
  });

  static delete = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    await deletePost(req.params.id);
    sendSuccess(res, null, "Post deleted successfully.");
  });
}
