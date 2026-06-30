import { Router } from "express";
import { getCategories, getCategoryById, getCategoryWithProduct, getEditCategory, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from "../controllers/categoryController";

const router = Router();

router.get("/", getCategories);
router.post("/", createCategoryHandler);
router.get("/:id", getCategoryById);
router.get("/:id/products", getCategoryWithProduct);
router.get("/:id/edit", getEditCategory);
router.put("/:id", updateCategoryHandler);
router.delete("/:id", deleteCategoryHandler);

export default router;
