import { Router } from "express";
import { healthCheck } from "../controllers/healthController";
import usersRoutes from "../routes/usersRoute";

const router = Router();

router.get("/health", healthCheck);
router.use("/users", usersRoutes);

// Register your routes here:
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

export default router;
