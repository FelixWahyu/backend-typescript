import { Router } from "express";
import { healthCheck } from "../controllers/healthController";

const router = Router();

router.get("/health", healthCheck);

// Register your routes here:
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

export default router;
