import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../../../middlewares/authMiddleware";
import { validate } from "../../../middlewares/validate";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validations/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh-token", validate(refreshTokenSchema), AuthController.refreshToken);
router.post("/logout", authenticate, AuthController.logout);
router.get("/me", authenticate, AuthController.getMe);

export default router;
