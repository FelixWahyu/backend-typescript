import { Router } from "express";
import { uploadSingle, uploadMultiple, uploadFields } from "../config/multer";
import { getAllProducts, getProductById, createProductHandler, addImagesHandler, updateProductHandler, deleteImageHandler, deleteProductHandler } from "../controllers/productController";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { createProductSchema, updateProductSchema } from "../validations";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", authenticate, authorize("ADMIN"), uploadFields, validate(createProductSchema), createProductHandler);
router.post("/:id/images", authenticate, authorize("ADMIN"), uploadMultiple, addImagesHandler);
router.put("/:id", authenticate, authorize("ADMIN"), uploadSingle, validate(updateProductSchema), updateProductHandler);
router.delete("/images/:imageId", authenticate, authorize("ADMIN"), deleteImageHandler);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteProductHandler);

export default router;
