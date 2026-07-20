import { prisma } from "../../../lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { AppError } from "../../../utils/appError";
import { generateUniqueSlug } from "../../../utils/slug";
import { CreateBlog, UpdateBlog, ResponseBlog, toBlogResponse } from "../model/blog.model";

export class BlogService {
  static async getBlogs(): Promise<Array<ResponseBlog>> {
    const blogs = await prisma.blog.findMany();
    return blogs.map((blog) => toBlogResponse(blog));
  }

  static async getBlogById(id: string): Promise<ResponseBlog> {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });
    if (!blog) throw new AppError("Data blog tidak ditemukan.", 404);
    return toBlogResponse(blog);
  }

  static async createBlog(request: CreateBlog): Promise<ResponseBlog> {
    const blog = await prisma.blog.findFirst({
      where: { title: request.title },
    });
    if (blog) throw new AppError("Title blog sudah digunakan.", 409);
    const slug = await generateUniqueSlug(request.title);
    const created = await prisma.blog.create({
      data: { ...request, slug },
    });
    return toBlogResponse(created);
  }

  static async updateBlog(id: string, request: UpdateBlog): Promise<ResponseBlog> {
    const updateBlog: Prisma.BlogUpdateInput = {};
    await BlogService.getBlogById(id);
    if (request.title !== undefined) {
      updateBlog.title = request.title;
      updateBlog.slug = await generateUniqueSlug(request.title);
    }
    if (request.description !== undefined) {
      updateBlog.description = request.description;
    }
    if (request.published !== undefined) {
      updateBlog.published = request.published;
    }
    const updated = await prisma.blog.update({
      where: { id },
      data: updateBlog,
    });
    return toBlogResponse(updated);
  }

  static async deleteBlog(id: string): Promise<void> {
    await BlogService.getBlogById(id);
    await prisma.blog.delete({
      where: { id },
    });
  }
}
