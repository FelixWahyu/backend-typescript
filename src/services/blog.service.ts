import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/appError";
import { generateUniqueSlug } from "../utils/slug";
import { CreateBlog, ResponseBlog, UpdateBlog } from "../types/blog.type";
import { toBlogResponse } from "../model/blog.model";

export class BlogService {
  static async getAllBlog(): Promise<Array<ResponseBlog>> {
    const blogs = await prisma.blog.findMany();

    return blogs.map((blog) => toBlogResponse(blog));
  }

  static async getBlogById(id: string): Promise<ResponseBlog> {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) throw new AppError("Data blog tidak ada.", 404);

    return blog;
  }

  static async createBlog(request: CreateBlog): Promise<ResponseBlog> {
    const existing = await prisma.blog.findFirst({
      where: { title: request.title },
    });

    if (existing) throw new AppError("Judul blog sudah digunakan.", 409);

    const slug = await generateUniqueSlug(request.title);

    const blog = await prisma.blog.create({
      data: {
        ...request,
        slug,
      },
    });

    return blog;
  }

  static async updateBlog(id: string, request: UpdateBlog): Promise<ResponseBlog> {
    const updatedDataBlog: Prisma.BlogUpdateInput = {};

    const blog = await prisma.blog.findUnique({
      where: {
        id: id,
      },
    });

    if (!blog) {
      throw new AppError(`Data blog tidak ada.`, 404);
    }

    if (request.title !== undefined) {
      updatedDataBlog.title = request.title;
      updatedDataBlog.slug = await generateUniqueSlug(request.title);
    }

    if (request.description !== undefined) {
      updatedDataBlog.description = request.description;
    }

    if (request.published !== undefined) {
      updatedDataBlog.published = request.published;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: id },
      data: updatedDataBlog,
    });

    return updatedBlog;
  }

  static async deleteBlog(id: string): Promise<void> {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) throw new AppError("Data blog tidak ada.", 404);

    await prisma.blog.delete({
      where: {
        id,
      },
    });
  }
}
