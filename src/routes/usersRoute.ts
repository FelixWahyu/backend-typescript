import { Router } from "express";
import { getUsers, createUserHandler, getUserById, getEditUser, updateUser, deleteUser } from "../controllers/usersController";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { createUserSchema, updateUserSchema } from "../validations";

const router = Router();

router.get("/", authenticate, getUsers);
router.post("/", authenticate, authorize("ADMIN"), validate(createUserSchema), createUserHandler);
router.get("/:id", authenticate, getUserById);
router.get("/:id/edit", authenticate, getEditUser);
router.put("/:id", authenticate, validate(updateUserSchema), updateUser);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteUser);

export default router;
