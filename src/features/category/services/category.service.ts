import { prisma } from "../../../lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { AppError } from "../../../utils/appError";
import { generateUniqueSlug } from "../../../utils/slug";
import { CreateCategory, UpdateCategory, ResponseCategory, toCategoryResponse } from "../model/category.model";

export class CategoryService {
  static async getAllCategories(): Promise<Array<ResponseCategory>> {
    const categories = await prisma.category.findMany();

    return categories.map((category) => toCategoryResponse(category));
  }

  static async getCategoryById(id: string): Promise<ResponseCategory> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) throw new AppError("Category is not found.", 404);

    return toCategoryResponse(category);
  }

  static async createCategory(request: CreateCategory): Promise<ResponseCategory> {
    const category = await prisma.category.findFirst({
      where: { category_name: request.category_name },
    });

    if (category) throw new AppError("Category name has been taken.", 409);

    const slug = await generateUniqueSlug(request.category_name);

    const createCategory = await prisma.category.create({
      data: { ...request, slug },
    });

    return toCategoryResponse(createCategory);
  }

  static async updateCategory(id: string, request: UpdateCategory): Promise<ResponseCategory> {
    const UpdatedCategory: Prisma.CategoryUpdateInput = {};

    await CategoryService.getCategoryById(id);

    if (request.category_name !== undefined) {
      UpdatedCategory.category_name = request.category_name;
      UpdatedCategory.slug = await generateUniqueSlug(request.category_name);
    }

    const updated = await prisma.category.update({
      where: { id },
      data: UpdatedCategory,
    });

    return toCategoryResponse(updated);
  }

  static async deleteCategory(id: string): Promise<void> {
    await CategoryService.getCategoryById(id);
    await prisma.category.delete({
      where: { id },
    });
  }
}
