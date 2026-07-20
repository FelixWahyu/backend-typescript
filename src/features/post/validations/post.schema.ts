import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Judul tidak boleh kosong")
    .max(255, "Judul maksimal 255 karakter"),
  content: z
    .string()
    .max(10000, "Konten maksimal 10000 karakter")
    .optional(),
  published: z.boolean().optional(),
  authorId: z.string().min(1, "Author ID tidak boleh kosong"),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Judul tidak boleh kosong")
    .max(255, "Judul maksimal 255 karakter")
    .optional(),
  content: z
    .string()
    .max(10000, "Konten maksimal 10000 karakter")
    .optional(),
  published: z.boolean().optional(),
  authorId: z.string().min(1, "Author ID tidak boleh kosong").optional(),
});
