export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId?: string;
}

export interface CreateProductWithImagesDto extends CreateProductDto {
  images?: string[];
}

export interface ProductImageResponse {
  id: string;
  url: string;
  order: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  images: ProductImageResponse[];
  createdAt: Date;
}
