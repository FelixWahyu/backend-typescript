import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(3, "Judul tidak boleh kosong & minimal 3 karakter.").max(100, "Judul maksimal 100 karakter."),
  slug: z
    .string()
    .min(3, "Slug tidak boleh kosong & min 3 karakter")
    .max(100, "Slug maksimal 100 karakter.")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil,angka dan tanda strip."),
  description: z.string().max(10000, "Deskripsi maksimal 10000 karakter.").optional(),
  published: z.boolean().optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter.").max(100, "Judul maksimal 100 karakter.").optional(),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .max(100, "Slug maksimal 100 karakter.")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil,angka dan tanda strip.")
    .optional(),
  description: z.string().max(10000, "Deskripsi maksimal 10000 karakter.").optional(),
  published: z.boolean().optional(),
});
