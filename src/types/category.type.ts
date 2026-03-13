export interface CreateCategoryDto {
  category_name: string;
  slug: string;
}

export interface UpdateCategoryDto {
  category_name?: string;
  slug?: string;
}

export interface CategoryResponse {
  id: string;
  category_name: string;
  slug: string;
  createdAt: Date;
}

export interface PaginationQuery {
  limit?: number;
  page?: number;
}
