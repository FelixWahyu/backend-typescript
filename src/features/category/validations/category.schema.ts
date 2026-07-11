import { z } from "zod";

export const CreateCategorySchema = z.object({
  category_name: z.string().min(3, "Category name is required & min 3 character.").max(100, "Category name max 100 character."),
});

export const UpdateCategorySchema = z.object({
  category_name: z.string().min(3, "Category name is required & min 3 character.").max(100, "Category name max 100 character.").optional(),
});
