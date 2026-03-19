import { Router } from "express";
import { healthCheck } from "../controllers/healthController";
import usersRoutes from "../routes/usersRoute";
import productRoutes from "../routes/productRoute";
import categoriesRoutes from "../routes/categoryRoute";
import authRoutes from "../routes/authRoute";

const router = Router();

router.use("/auth", authRoutes);
router.get("/health", healthCheck);
router.use("/users", usersRoutes);
router.use("/categories", categoriesRoutes);
router.use("/products", productRoutes);

export default router;
