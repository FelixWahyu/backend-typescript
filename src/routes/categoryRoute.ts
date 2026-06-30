import { Router } from "express";
import { getCategories, getCategoryById, getCategoryWithProduct, getEditCategory, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from "../controllers/categoryController";
import { validate } from "../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../validations";

const router = Router();

router.get("/", getCategories);
router.post("/", validate(createCategorySchema), createCategoryHandler);
router.get("/:id", getCategoryById);
router.get("/:id/products", getCategoryWithProduct);
router.get("/:id/edit", getEditCategory);
router.put("/:id", validate(updateCategorySchema), updateCategoryHandler);
router.delete("/:id", deleteCategoryHandler);

export default router;
