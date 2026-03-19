import { Router } from "express";
import { registerHandler, loginHandler, refreshTokenHandler, logoutHandler, getMeHandler } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logoutHandler);
router.get("/me", authenticate, getMeHandler);

export default router;
