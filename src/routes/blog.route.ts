import { Router } from "express";
import { validate } from "../middlewares/validate";
import { BlogController } from "../features/blog/controllers/blog.controller";
import { createBlogSchema, updateBlogSchema } from "../features/blog/validations/blog.schema";

const router = Router();

router.get("/", BlogController.getAll);
router.get("/:id", BlogController.getById);
router.post("/", validate(createBlogSchema), BlogController.create);
router.put("/:id", validate(updateBlogSchema), BlogController.update);
router.delete("/:id", BlogController.delete);

export default router;
