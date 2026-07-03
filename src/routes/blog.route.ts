import { Router } from "express";
import { validate } from "../middlewares/validate";
import { BlogController } from "../controllers/blog.controller";
import { createBlogSchema } from "../validations";

const router = Router();

router.post("/", validate(createBlogSchema), BlogController.createBlog);

export default router;
