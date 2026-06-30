import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponse } from "../types/category.type";

/**
 * Field yang dipilih untuk response kategori.
 */
const selectCategory = {
  id: true,
  category_name: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Ambil semua kategori.
 */
export const findAllCategory = async (): Promise<CategoryResponse[]> => {
  const categories = await prisma.category.findMany({
    select: selectCategory,
    orderBy: { createdAt: "desc" },
  });

  return categories;
};

/**
 * Cari kategori berdasarkan ID.
 */
export const findCategoryById = async (id: string): Promise<CategoryResponse> => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: selectCategory,
  });

  if (!category) throw new AppError("Category not found", 404);

  return category;
};

/**
 * Ambil kategori beserta produk-produk di dalamnya.
 */
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

/**
 * Buat kategori baru. Cegah duplikasi nama & slug.
 */
export const createCategory = async (dto: CreateCategoryDto): Promise<CategoryResponse> => {
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ category_name: dto.category_name }, { slug: dto.slug }],
    },
  });

  if (existing) {
    if (existing.slug === dto.slug) {
      throw new AppError("Slug sudah digunakan", 409);
    }
    throw new AppError("Nama kategori sudah digunakan", 409);
  }

  const category = await prisma.category.create({
    data: dto,
    select: selectCategory,
  });

  return category;
};

/**
 * Update kategori. Cek duplikasi jika nama/slug diubah.
 */
export const updateCategory = async (id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> => {
  await findCategoryById(id);

  if (dto.category_name || dto.slug) {
    const orCondition: { category_name?: string; slug?: string }[] = [];

    if (dto.category_name) orCondition.push({ category_name: dto.category_name });
    if (dto.slug) orCondition.push({ slug: dto.slug });

    const existing = await prisma.category.findFirst({
      where: {
        OR: orCondition,
        NOT: { id },
      },
    });

    if (existing) {
      if (existing.slug === dto.slug) {
        throw new AppError("Slug sudah digunakan", 409);
      }
      throw new AppError("Nama kategori sudah digunakan", 409);
    }
  }

  const updated = await prisma.category.update({
    where: { id },
    data: dto,
    select: selectCategory,
  });

  return updated;
};

/**
 * Hapus kategori berdasarkan ID.
 */
export const deleteCategory = async (id: string): Promise<void> => {
  await findCategoryById(id);
  await prisma.category.delete({ where: { id } });
};
