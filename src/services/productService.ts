import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/appError";
import { deleteFile, deleteFiles } from "@/utils/fileHelper";
import { CreateProductDto, CreateProductWithImagesDto, ProductResponse } from "@/types/product.type";

const productSelect = {
  id: true,
  name: true,
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
      name: true,
      slug: true,
    },
  },
  createdAt: true,
};

// CREATE produk dengan satu gambar
export const createProduct = async (dto: CreateProductDto): Promise<ProductResponse> => {
  return prisma.product.create({
    data: dto,
    select: productSelect,
  });
};

// CREATE produk dengan gallery
export const createProductWithImages = async (dto: CreateProductWithImagesDto): Promise<ProductResponse> => {
  const { images, ...productData } = dto;

  return prisma.product.create({
    data: {
      ...productData,
      // Buat semua ProductImage sekaligus dalam satu transaksi
      images: images?.length
        ? {
            create: images.map((url, index) => ({
              url,
              order: index,
            })),
          }
        : undefined,
    },
    select: productSelect,
  });
};

// UPDATE gambar utama — hapus yang lama
export const updateProductImage = async (id: string, newImagePath: string): Promise<ProductResponse> => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError("Produk tidak ditemukan", 404);

  // Hapus file lama dari server
  if (product.image) {
    deleteFile(product.image);
  }

  return prisma.product.update({
    where: { id },
    data: { image: newImagePath },
    select: productSelect,
  });
};

// TAMBAH gambar ke gallery
export const addProductImages = async (productId: string, imagePaths: string[]): Promise<ProductResponse> => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError("Produk tidak ditemukan", 404);

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

  return prisma.product.findUnique({
    where: { id: productId },
    select: productSelect,
  }) as Promise<ProductResponse>;
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
