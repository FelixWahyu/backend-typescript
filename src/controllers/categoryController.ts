import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";
import { findAllCategory, findCategoryById, findCategoryWithProduct, createCategory, updateCategory, deleteCategory } from "../services/categoryService";

/**
 * GET /categories — Semua kategori.
 */
export const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await findAllCategory();
  sendSuccess(res, categories, "Get all categories success");
});

/**
 * GET /categories/:id — Detail kategori.
 */
export const getCategoryById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const category = await findCategoryById(req.params.id);
  sendSuccess(res, category, "Get category success");
});

/**
 * GET /categories/:id/products — Kategori dengan daftar produk.
 */
export const getCategoryWithProduct = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const categoryWithProduct = await findCategoryWithProduct(req.params.id);
  sendSuccess(res, categoryWithProduct, "Get category with product success");
});

/**
 * POST /categories — Buat kategori baru.
 */
export const createCategoryHandler = catchAsync(async (req: Request, res: Response) => {
  const category = await createCategory(req.body);
  sendCreated(res, category, "Category created successfully");
});

/**
 * GET /categories/:id/edit — Data kategori untuk form edit.
 */
export const getEditCategory = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const category = await findCategoryById(req.params.id);
  sendSuccess(res, category, "Get category for edit success");
});

/**
 * PUT /categories/:id — Update kategori.
 */
export const updateCategoryHandler = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const category = await updateCategory(req.params.id, req.body);
  sendSuccess(res, category, "Category updated successfully");
});

/**
 * DELETE /categories/:id — Hapus kategori.
 */
export const deleteCategoryHandler = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  await deleteCategory(req.params.id);
  sendSuccess(res, null, "Category deleted successfully");
});
