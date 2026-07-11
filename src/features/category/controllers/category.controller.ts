import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../../../utils/response";
import { catchAsync } from "../../../utils/catchAsync";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  static getAll = catchAsync(async (_req: Request, res: Response) => {
    const categories = await CategoryService.getAllCategories();
    sendSuccess(res, categories, "Get all categories successfully.");
  });

  static getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const category = await CategoryService.getCategoryById(req.params.id);
    sendSuccess(res, category, "Get category by id successfully.");
  });

  static createCategory = catchAsync(async (req: Request, res: Response) => {
    const createCategory = await CategoryService.createCategory(req.body);
    sendCreated(res, createCategory, "Category created is successfully.");
  });

  static getEditCategory = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const getEdit = await CategoryService.getCategoryById(req.params.id);
    sendSuccess(res, getEdit, "Get category for edit successfully.");
  });

  static updateCategory = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const updateCategory = await CategoryService.updateCategory(req.params.id, req.body);
    sendSuccess(res, updateCategory, "Updated category successfully.");
  });

  static deleteCategory = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    await CategoryService.deleteCategory(req.params.id);
    sendSuccess(res, null, "Delete category successfully.");
  });
}
