import { Router } from "express";
import { validate } from "../middlewares/validate";
import { BlogController } from "../controllers/blog.controller";
import { createBlogSchema, updateBlogSchema } from "../validations";

const router = Router();

router.post("/", validate(createBlogSchema), BlogController.createBlog);
router.put("/:id", validate(updateBlogSchema), BlogController.updateBlog);

export default router;
