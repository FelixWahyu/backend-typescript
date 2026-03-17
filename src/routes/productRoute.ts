import { Router } from "express";
import { uploadSingle, uploadMultiple, uploadFields } from "../config/multer";
import { getAllProducts, getProductById, createProductHandler, addImagesHandler, updateProductHandler, deleteImageHandler, deleteProductHandler } from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.post("/", uploadFields, createProductHandler);
router.get("/:id", getProductById);
router.post("/:id/images", uploadMultiple, addImagesHandler);
router.put("/:id", uploadSingle, updateProductHandler);
router.delete("/images/:imageId", deleteImageHandler);
router.delete("/:id", deleteProductHandler);

export default router;
