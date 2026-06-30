import { z } from "zod";

export const createCategorySchema = z.object({
  category_name: z
    .string()
    .min(1, "Nama kategori tidak boleh kosong")
    .max(100, "Nama kategori maksimal 100 karakter"),
  slug: z
    .string()
    .min(1, "Slug tidak boleh kosong")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda strip"),
});

export const updateCategorySchema = z.object({
  category_name: z
    .string()
    .min(1, "Nama kategori tidak boleh kosong")
    .max(100, "Nama kategori maksimal 100 karakter")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug tidak boleh kosong")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda strip")
    .optional(),
});
