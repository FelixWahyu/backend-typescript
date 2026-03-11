import { Router } from "express";
import { createDataUser, getUsers } from "../controllers/usersController";

const router = Router();

router.get("/", getUsers);
router.post("/", createDataUser);

export default router;
