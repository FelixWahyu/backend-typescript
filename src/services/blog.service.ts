import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { CreateBlog, ResponseBlog } from "../types/blog.type";

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
}
