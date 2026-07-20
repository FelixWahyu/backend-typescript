import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { BlogController } from "../features/blog/controllers/blog.controller";
import { createBlogSchema, updateBlogSchema } from "../features/blog/validations/blog.schema";

const router = Router();

router.get("/", BlogController.getAll);
router.get("/:id", BlogController.getById);

router.get("/:id/edit", authenticate, authorize("ADMIN"), BlogController.getEdit);
router.post("/", authenticate, authorize("ADMIN"), validate(createBlogSchema), BlogController.create);
router.put("/:id", authenticate, authorize("ADMIN"), validate(updateBlogSchema), BlogController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), BlogController.delete);

export default router;
