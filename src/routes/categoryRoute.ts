import { Router } from "express";
// import { getCategories, getCategoryById, getCategoryWithProduct, getEditCategory, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from "../controllers/categoryController";
// import { authenticate, authorize } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../features/category/validations/category.schema";
import { CategoryController } from "../features/category/controllers/category.controller";

const router = Router();

// router.get("/", getCategories);
// router.get("/:id", getCategoryById);
// router.get("/:id/products", getCategoryWithProduct);

// router.post("/", authenticate, authorize("ADMIN"), validate(createCategorySchema), createCategoryHandler);
// router.get("/:id/edit", authenticate, authorize("ADMIN"), getEditCategory);
// router.put("/:id", authenticate, authorize("ADMIN"), validate(updateCategorySchema), updateCategoryHandler);
// router.delete("/:id", authenticate, authorize("ADMIN"), deleteCategoryHandler);

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);

router.post("/", validate(createCategorySchema), CategoryController.create);
router.get("/:id/edit", CategoryController.getEdit);
router.put("/:id", validate(updateCategorySchema), CategoryController.update);
router.delete("/:id", CategoryController.delete);

export default router;
