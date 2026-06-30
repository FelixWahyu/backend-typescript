import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { deleteFile, deleteFiles } from "../utils/fileHelper";
import { CreateProductDto, CreateProductWithImagesDto, PaginateProductQuery, ProductResponse, UpdateProductDto } from "../types/product.type";

/**
 * Field yang dipilih untuk response produk (termasuk relasi).
 */
const productSelect = {
  id: true,
  product_name: true,
  slug: true,
  description: true,
  price: true,
  image: true,
  images: {
    select: { id: true, url: true, order: true },
    orderBy: { order: "asc" as const },
  },
  category: {
    select: {
      id: true,
      category_name: true,
      slug: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Ambil semua produk dengan pagination, filter category & search.
 */
export const findAllProducts = async (query: PaginateProductQuery = {}) => {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 10));
  const skip = (page - 1) * limit;

  const where = {
    ...(query.categoryId && { categoryId: query.categoryId }),
    ...(query.search && { product_name: { contains: query.search } }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: productSelect,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

/**
 * Cari produk berdasarkan ID.
 */
export const findProductById = async (id: string): Promise<ProductResponse> => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!product) throw new AppError(`Product dengan id ${id} tidak ada`, 404);

  return product;
};

/**
 * Cek duplikasi product_name & slug (opsional exclude ID untuk update).
 */
const checkDuplicate = async (product_name: string, slug: string, excludeId?: string): Promise<void> => {
  const existing = await prisma.product.findFirst({
    where: {
      OR: [{ product_name }, { slug }],
      ...(excludeId && { NOT: { id: excludeId } }),
    },
  });

  if (existing) {
    if (existing.product_name === product_name) {
      throw new AppError("Product name already taken", 409);
    }
    throw new AppError("Slug already taken", 409);
  }
};

/**
 * Buat produk baru (tanpa gallery).
 */
export const createProduct = async (dto: CreateProductDto): Promise<ProductResponse> => {
  await checkDuplicate(dto.product_name, dto.slug);

  const product = await prisma.product.create({
    data: dto,
    select: productSelect,
  });

  return product;
};

/**
 * Buat produk baru dengan gambar gallery.
 */
export const createProductWithImages = async (dto: CreateProductWithImagesDto): Promise<ProductResponse> => {
  await checkDuplicate(dto.product_name, dto.slug);

  const { images, ...productData } = dto;

  const product = await prisma.product.create({
    data: {
      ...productData,
      images: images?.length
        ? {
            create: images.map((url, index) => ({ url, order: index })),
          }
        : undefined,
    },
    select: productSelect,
  });

  return product;
};

/**
 * Update data produk.
 */
export const updateProduct = async (id: string, dto: UpdateProductDto): Promise<ProductResponse> => {
  await findProductById(id);

  if (dto.product_name || dto.slug) {
    const orCondition: { product_name?: string; slug?: string }[] = [];

    if (dto.product_name) orCondition.push({ product_name: dto.product_name });
    if (dto.slug) orCondition.push({ slug: dto.slug });

    const existing = await prisma.product.findFirst({
      where: {
        OR: orCondition,
        NOT: { id },
      },
    });

    if (existing) {
      if (existing.product_name === dto.product_name) {
        throw new AppError("Product name already taken", 409);
      }
      throw new AppError("Slug already taken", 409);
    }
  }

  const { categoryId, ...rest } = dto;

  return prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(categoryId !== undefined && {
        category: categoryId ? { connect: { id: categoryId } } : { disconnect: true },
      }),
    },
    select: productSelect,
  });
};

/**
 * Update gambar utama produk — hapus file lama dari server.
 */
export const updateProductImage = async (id: string, newImagePath: string): Promise<ProductResponse> => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!product) {
    throw new AppError(`Produk dengan id ${id} tidak ada`, 404);
  }

  if (product.image) {
    deleteFile(product.image);
  }

  return prisma.product.update({
    where: { id },
    data: { image: newImagePath },
    select: productSelect,
  });
};

/**
 * Tambah gambar ke gallery produk.
 */
export const addProductImages = async (productId: string, imagePaths: string[]): Promise<ProductResponse> => {
  await findProductById(productId);

  const lastImage = await prisma.productImage.findFirst({
    where: { productId },
    orderBy: { order: "desc" },
  });

  const startOrder = (lastImage?.order ?? -1) + 1;

  await prisma.productImage.createMany({
    data: imagePaths.map((url, index) => ({
      url,
      productId,
      order: startOrder + index,
    })),
  });

  return findProductById(productId);
};

/**
 * Hapus satu gambar dari gallery (file + database).
 */
export const deleteProductImage = async (imageId: string): Promise<void> => {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });

  if (!image) throw new AppError("Gambar tidak ditemukan", 404);

  deleteFile(image.url);
  await prisma.productImage.delete({ where: { id: imageId } });
};

/**
 * Hapus produk beserta semua file gambar terkait.
 */
export const deleteProduct = async (id: string): Promise<void> => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      image: true,
      images: { select: { url: true } },
    },
  });

  if (!product) throw new AppError(`Product dengan id ${id} tidak ada`, 404);

  const allFiles: string[] = [
    ...(product.image ? [product.image] : []),
    ...product.images.map((img) => img.url),
  ];

  if (allFiles.length > 0) {
    deleteFiles(allFiles);
  }

  await prisma.product.delete({ where: { id } });
};
