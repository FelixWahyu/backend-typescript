import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { CreateBlog, ResponseBlog, UpdateBlog } from "../types/blog.type";

export class BlogService {
  static async createBlog(request: CreateBlog): Promise<ResponseBlog> {
    const existing = await prisma.blog.findFirst({
      where: { title: request.title },
    });

    if (existing) throw new AppError("Judul blog sudah digunakan.", 409);

    const blog = await prisma.blog.create({
      data: request,
    });

    return blog;
  }

  static async updateBlog(id: string, request: UpdateBlog): Promise<ResponseBlog> {
    const blogIsExisting = await prisma.blog.findUnique({
      where: {
        id: id,
      },
    });

    if (!blogIsExisting) {
      throw new AppError(`Data blog tidak ada.`, 404);
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: id },
      data: request,
    });

    return updatedBlog;
  }
}
