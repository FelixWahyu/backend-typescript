import { Prisma } from "@/generated/prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
  };
}>;

export type CreateProduct = {
  product_name: string;
  categoryId?: string;
  price: number;
  description?: string;
  image?: string;
};

export type CreateProductImages = CreateProduct & {
  images?: string[];
};

export type UpdateProduct = {
  product_name?: string;
  categoryId?: string;
  price?: number;
  description?: string;
  image?: string;
};

export type UpdateProductImages = UpdateProduct & {
  images?: string[];
};

export type ResponseProductImages = {
  id: string;
  url: string;
  order: number;
};

export type ResponseProduct = {
  id: string;
  product_name: string;
  slug: string;
  category: {
    id: string;
    category_name: string;
    slug: string;
  } | null;
  price: number;
  description: string | null;
  image: string | null;
  images: ResponseProductImages[];
  createdAt: Date;
  updatedAt: Date;
};

export type PaginateProductQuery = {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
};

export function toProductResponse(product: ProductWithRelations): ResponseProduct {
  return {
    id: product.id,
    product_name: product.product_name,
    slug: product.slug,
    category: product.category
      ? {
          id: product.category.id,
          category_name: product.category.category_name,
          slug: product.category.slug,
        }
      : null,
    price: product.price,
    description: product.description,
    image: product.image,
    images: product.images.map((imageGallery) => ({
      id: imageGallery.id,
      url: imageGallery.url,
      order: imageGallery.order,
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
