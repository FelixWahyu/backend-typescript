import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate, authorize } from "../../../middlewares/authMiddleware";
import { validate } from "../../../middlewares/validate";
import { createUserSchema, updateUserSchema } from "../validations/user.schema";

const router = Router();

router.get("/", authenticate, UserController.getAll);
router.post("/", authenticate, authorize("ADMIN"), validate(createUserSchema), UserController.create);
router.get("/:id", authenticate, UserController.getById);
router.get("/:id/edit", authenticate, UserController.getEditUser);
router.put("/:id", authenticate, authorize("ADMIN"), validate(updateUserSchema), UserController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), UserController.delete);

export default router;
