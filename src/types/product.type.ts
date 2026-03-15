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
  images?: CreateProductWithImagesDto;
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
  description: string | null;
  price: number;
  image: string | null;
  images: ProductImageResponse[];
  createdAt: Date;
}
