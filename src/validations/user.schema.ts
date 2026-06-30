import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .max(100, "Nama maksimal 100 karakter")
    .nullable()
    .optional(),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
  email: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(128, "Password maksimal 128 karakter"),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .max(100, "Nama maksimal 100 karakter")
    .nullable()
    .optional(),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore")
    .optional(),
  email: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter")
    .optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});
