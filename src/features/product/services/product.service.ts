import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/appError";
import { generateUniqueSlug } from "@/utils/slug";
import { deleteFiles } from "@/utils/fileHelper";
import { 
  CreateProductImages, 
  UpdateProductImages, 
  ResponseProduct, 
  toProductResponse, 
  PaginateProductQuery 
} from "../model/product.model";

export class ProductService {
  static async getProducts(query: PaginateProductQuery = {}): Promise<{
    data: Array<ResponseProduct>;
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));
    const skip = (page - 1) * limit;

    const where = {
      ...(query.categoryId && { categoryId: query.categoryId }),
      ...(query.search && { product_name: { contains: query.search } }),
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products.map((product) => toProductResponse(product)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string): Promise<ResponseProduct> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });
    if (!product) throw new AppError("Product not found.", 404);
    return toProductResponse(product);
  }

  static async createProduct(request: CreateProductImages): Promise<ResponseProduct> {
    const product = await prisma.product.findFirst({
      where: {
        product_name: request.product_name,
      },
    });
    if (product) throw new AppError("Product name has been taken.", 409);
    const slug = await generateUniqueSlug(request.product_name);
    
    const { images, ...productData } = request;

    const created = await prisma.product.create({
      data: {
        ...productData,
        slug,
        images: images?.length
          ? {
              create: images.map((url, index) => ({ url, order: index })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });
    return toProductResponse(created);
  }

  static async updateProduct(id: string, request: UpdateProductImages): Promise<ResponseProduct> {
    const existingProduct = await this.getProductById(id);

    let slug = existingProduct.slug;
    if (request.product_name && request.product_name !== existingProduct.product_name) {
      const duplicateName = await prisma.product.findFirst({
        where: {
          product_name: request.product_name,
          NOT: { id },
        },
      });
      if (duplicateName) throw new AppError("Product name has been taken.", 409);
      slug = await generateUniqueSlug(request.product_name);
    }

    if (request.image && existingProduct.image && request.image !== existingProduct.image) {
      deleteFiles([existingProduct.image]);
    }

    const { images, ...productData } = request;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        slug,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return toProductResponse(updated);
  }

  static async addProductImages(productId: string, imagePaths: string[]): Promise<ResponseProduct> {
    await this.getProductById(productId);

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

    return this.getProductById(productId);
  }

  static async deleteProductImage(imageId: string): Promise<void> {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) throw new AppError("Gambar tidak ditemukan", 404);

    deleteFiles([image.url]);
    await prisma.productImage.delete({ where: { id: imageId } });
  }

  static async deleteProduct(id: string): Promise<void> {
    const product = await this.getProductById(id);

    const allFiles: string[] = [
      ...(product.image ? [product.image] : []),
      ...product.images.map((img) => img.url),
    ];

    if (allFiles.length > 0) {
      deleteFiles(allFiles);
    }

    await prisma.product.delete({
      where: { id },
    });
  }
}
