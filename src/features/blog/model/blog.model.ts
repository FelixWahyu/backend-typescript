import { Blog } from "@/generated/prisma/client";

export type ResponseBlog = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBlog = {
  title: string;
  description?: string;
  published?: boolean;
};

export type UpdateBlog = {
  title?: string;
  description?: string;
  published?: boolean;
};

export type PaginationQueryBlog = {
  limit?: number;
  page?: number;
};

export function toBlogResponse(blog: Blog): ResponseBlog {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    published: blog.published,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
}
