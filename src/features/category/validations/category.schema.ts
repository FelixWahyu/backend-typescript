import { z } from "zod";

export const createCategorySchema = z.object({
  category_name: z.string().min(1, "Nama kategori tidak boleh kosong").max(100, "Nama kategori maksimal 100 karakter"),
});

export const updateCategorySchema = z.object({
  category_name: z.string().min(1, "Nama kategori tidak boleh kosong").max(100, "Nama kategori maksimal 100 karakter").optional(),
});
