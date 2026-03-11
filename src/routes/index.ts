import { Router } from "express";
import { healthCheck } from "../controllers/healthController";
import usersRoutes from "../routes/usersRoute";

const router = Router();

router.get("/health", healthCheck);
router.use("/users", usersRoutes);

export default router;
