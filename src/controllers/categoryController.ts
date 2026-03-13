import { Request, Response, NextFunction } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { findAllCategory, findCategoryById, findCategoryWithProduct, createCategory, updateCategory, deleteCategory } from "../services/categoryService";

interface CategoryParams {
  id: string;
}

export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await findAllCategory();
    sendSuccess(res, categories, "Get all categories success");
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request<CategoryParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await findCategoryById(req.params.id);
    sendSuccess(res, category, "Get category success");
  } catch (error) {
    next(error);
  }
};

export const getCategoryWithProduct = async (req: Request<CategoryParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryWithProduct = await findCategoryWithProduct(req.params.id);
    sendSuccess(res, categoryWithProduct, "Get category with product success");
  } catch (error) {
    next(error);
  }
};

export const createNewCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await createCategory(req.body);
    sendCreated(res, category, "Category created successfully");
  } catch (error) {
    next(error);
  }
};

export const getEditCategory = async (req: Request<CategoryParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await findCategoryById(req.params.id);
    sendSuccess(res, category, "Get category for edit success");
  } catch (error) {
    next(error);
  }
};

export const updatedCategory = async (req: Request<CategoryParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    sendSuccess(res, category, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deletedCategory = async (req: Request<CategoryParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteCategory(req.params.id);
    sendSuccess(res, null, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};
