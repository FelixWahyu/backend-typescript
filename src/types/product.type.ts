export interface CreateProductDto {
  product_name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  categoryId?: string;
}

export interface CreateProductWithImagesDto extends CreateProductDto {
  images?: string[];
}

export interface UpdateProductDto {
  product_name?: string;
  slug?: string;
  categoryId?: string;
  price?: number;
  description?: string;
  image?: string;
}

export interface ProductImageResponse {
  id: string;
  url: string;
  order: number;
}

export interface ProductResponse {
  id: string;
  product_name: string;
  slug: string;
  category: {
    id: string;
    category_name: string;
    slug: string;
  } | null;
  description: string | null;
  price: number;
  image: string | null;
  images: ProductImageResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginateProductQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}
