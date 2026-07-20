import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/appError";
import { 
  CreatePost, 
  UpdatePost, 
  ResponsePost, 
  toPostResponse, 
  PaginatePostQuery 
} from "../model/post.model";

const selectPost = {
  id: true,
  title: true,
  content: true,
  published: true,
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const;

export class PostService {
  static async getPosts(query: PaginatePostQuery = {}): Promise<{
    data: Array<ResponsePost>;
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));
    const skip = (page - 1) * limit;

    const where = {
      ...(query.search && { title: { contains: query.search } }),
    };

    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        select: selectPost,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      data: posts.map((post) => toPostResponse(post)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getPostById(id: string): Promise<ResponsePost> {
    const post = await prisma.post.findUnique({
      where: { id },
      select: selectPost,
    });

    if (!post) throw new AppError(`Data post dengan id ${id} tidak ada.`, 404);

    return toPostResponse(post);
  }

  static async createPost(dto: CreatePost): Promise<ResponsePost> {
    const author = await prisma.user.findUnique({
      where: { id: dto.authorId },
    });

    if (!author) throw new AppError("Author tidak ditemukan.", 404);

    const existing = await prisma.post.findFirst({
      where: { title: dto.title },
    });

    if (existing) throw new AppError("Post title already taken.", 409);

    const post = await prisma.post.create({
      data: dto,
      select: selectPost,
    });

    return toPostResponse(post);
  }

  static async updatePost(id: string, dto: UpdatePost): Promise<ResponsePost> {
    await this.getPostById(id);

    if (dto.title) {
      const existing = await prisma.post.findFirst({
        where: {
          title: dto.title,
          NOT: { id },
        },
      });

      if (existing) throw new AppError("Post title sudah digunakan.", 409);
    }

    const updated = await prisma.post.update({
      where: { id },
      data: dto,
      select: selectPost,
    });

    return toPostResponse(updated);
  }

  static async deletePost(id: string): Promise<void> {
    await this.getPostById(id);
    await prisma.post.delete({ where: { id } });
  }
}
