import { Blog } from "@/generated/prisma/client";
import { ResponseBlog } from "@/types/blog.type";

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
