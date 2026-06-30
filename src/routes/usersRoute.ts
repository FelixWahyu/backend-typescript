import { Router } from "express";
import { getUsers, createUserHandler, getUserById, getEditUser, updateUser, deleteUser } from "../controllers/usersController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticate, getUsers);
router.post("/", authenticate, authorize("ADMIN"), createUserHandler);
router.get("/:id", authenticate, getUserById);
router.get("/:id/edit", authenticate, getEditUser);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteUser);

export default router;
