import { Router } from "express";
import { registerHandler, loginHandler, refreshTokenHandler, logoutHandler, getMeHandler } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validations";

const router = Router();

router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);
router.post("/refresh-token", validate(refreshTokenSchema), refreshTokenHandler);
router.post("/logout", authenticate, logoutHandler);
router.get("/me", authenticate, getMeHandler);

export default router;
