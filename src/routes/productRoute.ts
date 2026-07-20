import { Router } from "express";
import { uploadSingle, uploadMultiple, uploadFields } from "../config/multer";
import { ProductController } from "../features/product/controllers/product.controller";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { createProductSchema, updateProductSchema } from "../features/product/validations/product.schema";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

router.post("/", authenticate, authorize("ADMIN"), uploadFields, validate(createProductSchema), ProductController.create);
router.post("/:id/images", authenticate, authorize("ADMIN"), uploadMultiple, ProductController.addImages);
router.put("/:id", authenticate, authorize("ADMIN"), uploadSingle, validate(updateProductSchema), ProductController.update);
router.delete("/images/:imageId", authenticate, authorize("ADMIN"), ProductController.deleteImage);
router.delete("/:id", authenticate, authorize("ADMIN"), ProductController.delete);

export default router;
