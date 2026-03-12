import { Router } from "express";
import { createdUser, deleteUser, getEditUser, getUserById, getUsers, updateUser } from "../controllers/usersController";

const router = Router();

router.get("/", getUsers);
router.post("/", createdUser);
router.get("/:id", getUserById);
router.get("/:id/edit", getEditUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
