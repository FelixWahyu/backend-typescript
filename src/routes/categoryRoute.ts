import { Router } from "express";
import { createNewCategory, deletedCategory, getCategories, getCategoryById, getCategoryWithProduct, getEditCategory, updatedCategory } from "../controllers/categoryController";

const router = Router();

router.get("/", getCategories);
router.post("/", createNewCategory);
router.get("/:id", getCategoryById);
router.get("/:id/products", getCategoryWithProduct);
router.get("/:id/edit", getEditCategory);
router.put("/:id", updatedCategory);
router.delete("/:id", deletedCategory);

export default router;
