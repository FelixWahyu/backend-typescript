import { z } from "zod";

export const createProductSchema = z.object({
  product_name: z
    .string()
    .min(1, "Nama produk tidak boleh kosong")
    .max(200, "Nama produk maksimal 200 karakter"),
  slug: z
    .string()
    .min(1, "Slug tidak boleh kosong")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda strip"),
  description: z
    .string()
    .max(5000, "Deskripsi maksimal 5000 karakter")
    .optional(),
  price: z.coerce
    .number()
    .min(0, "Harga tidak boleh negatif")
    .max(999999999, "Harga terlalu besar"),
  categoryId: z.string().uuid("Format categoryId tidak valid").optional(),
});

export const updateProductSchema = z.object({
  product_name: z
    .string()
    .min(1, "Nama produk tidak boleh kosong")
    .max(200, "Nama produk maksimal 200 karakter")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug tidak boleh kosong")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda strip")
    .optional(),
  description: z
    .string()
    .max(5000, "Deskripsi maksimal 5000 karakter")
    .optional(),
  price: z.coerce
    .number()
    .min(0, "Harga tidak boleh negatif")
    .max(999999999, "Harga terlalu besar")
    .optional(),
  categoryId: z.string().uuid("Format categoryId tidak valid").nullable().optional(),
  image: z.string().optional(),
});
