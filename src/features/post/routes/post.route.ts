import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { authenticate, authorize } from "../../../middlewares/authMiddleware";
import { validate } from "../../../middlewares/validate";
import { createPostSchema, updatePostSchema } from "../validations/post.schema";

const router = Router();

router.get("/", PostController.getAll);
router.get("/:id", PostController.getById);
router.get("/:id/edit", authenticate, authorize("ADMIN"), PostController.getEdit);

router.post("/", authenticate, authorize("ADMIN"), validate(createPostSchema), PostController.create);
router.put("/:id", authenticate, authorize("ADMIN"), validate(updatePostSchema), PostController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), PostController.delete);

export default router;
