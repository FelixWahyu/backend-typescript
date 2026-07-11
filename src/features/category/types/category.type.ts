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
