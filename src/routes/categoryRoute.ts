import { Router } from "express";
import { getCategories, getCategoryById, getCategoryWithProduct, getEditCategory, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from "../controllers/categoryController";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../validations";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getCategoryWithProduct);
router.get("/:id/edit", authenticate, getEditCategory);

router.post("/", authenticate, authorize("ADMIN"), validate(createCategorySchema), createCategoryHandler);
router.put("/:id", authenticate, authorize("ADMIN"), validate(updateCategorySchema), updateCategoryHandler);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteCategoryHandler);

export default router;
