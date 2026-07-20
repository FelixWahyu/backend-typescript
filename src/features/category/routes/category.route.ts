import { Router } from "express";
import { authenticate, authorize } from "../../../middlewares/authMiddleware";
import { validate } from "../../../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../validations/category.schema";
import { CategoryController } from "../controllers/category.controller";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);

router.post("/", authenticate, authorize("ADMIN"), validate(createCategorySchema), CategoryController.create);
router.get("/:id/edit", authenticate, authorize("ADMIN"), CategoryController.getEdit);
router.put("/:id", authenticate, authorize("ADMIN"), validate(updateCategorySchema), CategoryController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), CategoryController.delete);

export default router;
