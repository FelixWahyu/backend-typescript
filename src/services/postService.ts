import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { CreatePost, UpdatePost, PostResponse, PaginationQuery } from "../types/post.type";

const selectPost = {
  id: true,
  title: true,
  content: true,
  published: true,
  author: {
    select: {
      id: true,
      name: true,
      username: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const;

export const findAllPost = async (query: PaginationQuery = {}) => {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 10));
  const skip = (page - 1) * limit;

  const where = {
    ...(query.search && { title: { contains: query.search } }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      select: selectPost,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  const result = { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };

  return result;
};

export const findPostById = async (id: string): Promise<PostResponse> => {
  const isExist = await prisma.post.findUnique({
    where: { id },
    select: selectPost,
  });

  if (!isExist) throw new AppError(`Data post dengan id ${id} tidak ada.`, 404);

  return isExist;
};

export const createPost = async (dto: CreatePost): Promise<PostResponse> => {
  const author = await prisma.user.findUnique({
    where: { id: dto.authorId },
  });
  if (!author) throw new AppError("Author tidak ditemukan.", 404);

  const isExist = await prisma.post.findFirst({
    where: { title: dto.title },
  });
  if (isExist) throw new AppError("Post title already taken.", 409);

  const post = await prisma.post.create({ data: dto, select: selectPost });

  return post;
};

export const updatePostById = async (id: string, dto: UpdatePost): Promise<PostResponse> => {
  await findPostById(id);

  if (dto.title) {
    const isExist = await prisma.post.findFirst({
      where: {
        title: dto.title,
        NOT: { id },
      },
    });

    if (isExist) throw new AppError("Post title sudah digunakan.", 409);
  }

  const postUpdated = await prisma.post.update({
    where: { id },
    data: dto,
    select: selectPost,
  });

  return postUpdated;
};

export const deletePost = async (id: string): Promise<void> => {
  await findPostById(id);
  await prisma.post.delete({
    where: { id },
  });
};
