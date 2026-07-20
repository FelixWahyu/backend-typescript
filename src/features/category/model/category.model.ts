import { Category } from "@/generated/prisma/client";

export type ResponseCategory = {
  id: string;
  category_name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCategory = {
  category_name: string;
};

export type UpdateCategory = {
  category_name?: string;
};

export type PaginationQuery = {
  limit?: number;
  page?: number;
};

export function toCategoryResponse(category: Category): ResponseCategory {
  return {
    id: category.id,
    category_name: category.category_name,
    slug: category.slug,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
