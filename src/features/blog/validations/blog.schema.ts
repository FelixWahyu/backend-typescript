import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(3, "Judul tidak boleh kosong & minimal 3 karakter.").max(100, "Judul maksimal 100 karakter."),
  description: z.string().max(10000, "Deskripsi maksimal 10000 karakter.").optional(),
  published: z.boolean().optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter.").max(100, "Judul maksimal 100 karakter.").optional(),
  description: z.string().max(10000, "Deskripsi maksimal 10000 karakter.").optional(),
  published: z.boolean().optional(),
});
