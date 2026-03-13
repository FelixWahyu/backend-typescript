import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponse, PaginationQuery } from "../types/category.type";

const selectCategory = {
  id: true,
  category_name: true,
  slug: true,
  createdAt: true,
} as const;

export const findAllCategory = async (query: PaginationQuery = {}): Promise<CategoryResponse[]> => {
  // const page = Math.max(1, query.page ?? 1);
  // const limit = Math.min(10, Math.max(1, query.limit ?? 10));
  // const skip = (page - 1) * limit;

  // const [data, total] = prisma.$transaction([
  //   prisma.category.findMany({
  //     select: selectCategory,
  //     skip,
  //     take: limit,
  //     orderBy: { createdAt: "desc" },
  //   }),
  //   prisma.category.count(),
  // ]);

  // const result = { data, meta: { page, limit, total, totalPage: Math.ceil(total / limit) } };

  const categories = await prisma.category.findMany({ select: selectCategory, orderBy: { createdAt: "desc" } });

  if (!categories) {
    throw new AppError("Gagal mengambil data kategori", 500);
  }

  return categories;
};

export const findCategoryById = async (id: string): Promise<CategoryResponse> => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: selectCategory,
  });

  if (!category) throw new AppError("Category not found", 404);

  return category;
};

export const findCategoryWithProduct = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      ...selectCategory,
      products: {
        select: {
          id: true,
          product_name: true,
          price: true,
          image: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) throw new AppError("Kategori tidak ditemukan", 404);

  return category;
};

export const createCategory = async (dto: CreateCategoryDto): Promise<CategoryResponse> => {
  const isExist = await prisma.category.findFirst({
    where: {
      OR: [{ category_name: dto.category_name }, { slug: dto.slug }],
    },
  });

  if (isExist) {
    if (isExist.slug === dto.slug) {
      throw new AppError("Slug sudah digunakan", 409);
    }
    throw new AppError("Nama kategoori sudah digunakan", 409);
  }

  const category = await prisma.category.create({ data: dto, select: selectCategory });

  return category;
};

export const updateCategory = async (id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> => {
  await findCategoryById(id);

  if (dto.category_name || dto.slug) {
    const orCondition: { category_name?: string; slug?: string }[] = [];

    if (dto.category_name) orCondition.push({ category_name: dto.category_name });
    if (dto.slug) orCondition.push({ slug: dto.slug });

    const isExist = await prisma.category.findFirst({
      where: {
        OR: orCondition,
        NOT: { id },
      },
    });

    if (isExist) {
      if (isExist.slug === dto.slug) {
        throw new AppError("Slug sudah digunakan", 409);
      }
      throw new AppError("Nama kategori sudah digunakan", 409);
    }
  }

  const categoryUpdated = await prisma.category.update({ where: { id }, data: dto, select: selectCategory });

  return categoryUpdated;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await findCategoryById(id);
  await prisma.category.delete({ where: { id } });
};
