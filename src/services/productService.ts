import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { deleteFile, deleteFiles } from "../utils/fileHelper";
import { CreateProductDto, CreateProductWithImagesDto, PaginateProductQuery, ProductResponse, UpdateProductDto } from "../types/product.type";

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

  const result = { data, meta: { page, limit, total, totalPage: Math.ceil(total / limit) } };

  return result;
};

export const findProductById = async (id: string): Promise<ProductResponse> => {
  const isExist = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!isExist) throw new AppError(`Product dengan id ${id} tidak ada`, 404);

  return isExist;
};

const checkDuplicate = async (product_name: string, slug: string, excludeId?: string): Promise<void> => {
  const isExisting = await prisma.product.findFirst({
    where: {
      OR: [{ product_name }, { slug }],
      ...(excludeId && { NOT: { id: excludeId } }),
    },
  });

  if (isExisting) {
    if (isExisting.product_name === product_name) {
      throw new AppError("Product name already taken", 409);
    }
    throw new AppError("Slug already taken", 409);
  }
};

// CREATE produk dengan satu gambar
export const createProduct = async (dto: CreateProductDto): Promise<ProductResponse> => {
  await checkDuplicate(dto.product_name, dto.slug);

  const product = await prisma.product.create({
    data: dto,
    select: productSelect,
  });

  return product;
};

// CREATE produk dengan gallery
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

export const updateProduct = async (id: string, dto: UpdateProductDto): Promise<ProductResponse> => {
  await findProductById(id);

  if (dto.product_name || dto.slug) {
    const orCondition: { product_name?: string; slug?: string }[] = [];

    if (dto.product_name) orCondition.push({ product_name: dto.product_name });
    if (dto.slug) orCondition.push({ slug: dto.slug });

    const isExisting = await prisma.product.findFirst({
      where: {
        OR: orCondition,
        NOT: { id },
      },
    });

    if (isExisting) {
      if (isExisting.product_name === dto.product_name) {
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

// UPDATE gambar utama — hapus yang lama
export const updateProductImage = async (id: string, newImagePath: string): Promise<ProductResponse> => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!product) {
    throw new AppError(`Produk dengan id ${id} tidak ada`, 404);
  }

  // Hapus file lama dari server
  if (product.image) {
    deleteFile(product.image);
  }

  const productUpdate = await prisma.product.update({
    where: { id },
    data: { image: newImagePath },
    select: productSelect,
  });

  return productUpdate;
};

// TAMBAH gambar ke gallery
export const addProductImages = async (productId: string, imagePaths: string[]): Promise<ProductResponse> => {
  await findProductById(productId);

  // Cari order terakhir
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

// HAPUS satu gambar dari gallery
export const deleteProductImage = async (imageId: string): Promise<void> => {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });

  if (!image) throw new AppError("Gambar tidak ditemukan", 404);

  // Hapus file dari server dulu, baru hapus dari DB
  deleteFile(image.url);

  await prisma.productImage.delete({ where: { id: imageId } });
};

export const deleteProduct = async (id: string): Promise<void> => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      image: true,
      images: { select: { url: true } },
    },
  });

  if (!product) throw new AppError(`Product dengan id ${id} tidak ada`, 404);

  const allFiles: string[] = [...(product?.image ? [product.image] : []), ...(product?.images.map((img) => img.url) ?? [])];

  if (allFiles.length > 0) {
    deleteFiles(allFiles);
  }

  await prisma.product.delete({ where: { id } });
};
