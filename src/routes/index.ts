import { Router } from "express";
import { healthCheck } from "../controllers/healthController";
import usersRoutes from "../routes/usersRoute";
import productRoutes from "../routes/productRoute";

const router = Router();

router.get("/health", healthCheck);
router.use("/users", usersRoutes);
router.use("/products", productRoutes);

export default router;
