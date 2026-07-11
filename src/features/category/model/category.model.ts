import { Category } from "@/generated/prisma/client";
import { ResponseCategory } from "../types/category.type";

export function toCategoryResponse(category: Category): ResponseCategory {
  return {
    id: category.id,
    category_name: category.category_name,
    slug: category.slug,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
