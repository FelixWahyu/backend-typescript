import { Router } from "express";
import { healthCheck } from "../controllers/healthController";
import usersRoutes from "../features/user/routes/user.route";
import productRoutes from "../features/product/routes/product.route";
import categoriesRoutes from "../features/category/routes/category.route";
import authRoutes from "../features/auth/routes/auth.route";
import postRoutes from "../features/post/routes/post.route";
import blogRoutes from "../features/blog/routes/blog.route";

const router = Router();

router.use("/auth", authRoutes);
router.get("/health", healthCheck);
router.use("/users", usersRoutes);
router.use("/categories", categoriesRoutes);
router.use("/products", productRoutes);
router.use("/posts", postRoutes);
router.use("/blogs", blogRoutes);

export default router;
