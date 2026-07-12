import { Router } from "express";
import { validate } from "../middlewares/validate";
import { BlogController } from "../features/blog/controllers/blog.controller";
import { createBlogSchema, updateBlogSchema } from "../validations";

const router = Router();

router.get("/", BlogController.getAll);
router.get("/:id", BlogController.getById);
router.post("/", validate(createBlogSchema), BlogController.createdBlog);
router.put("/:id", validate(updateBlogSchema), BlogController.updatedBlog);
router.delete("/:id", BlogController.deleteBlog);

export default router;
