export interface CreateBlog {
  title: string;
  slug: string;
  description?: string;
  published?: boolean;
}

export interface UpdateBlog {
  title?: string;
  slug?: string;
  description?: string;
  published?: boolean;
}

export interface ResponseBlog {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
