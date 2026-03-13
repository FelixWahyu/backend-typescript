import { Router } from "express";
import { uploadSingle, uploadMultiple } from "../config/multer";
import { createProductHandler, createProductWithGalleryHandler, addImagesHandler, deleteImageHandler } from "../controllers/productController";

const router = Router();

// Satu gambar utama
router.post("/", uploadSingle, createProductHandler);

// Banyak gambar sekaligus
router.post("/gallery", uploadMultiple, createProductWithGalleryHandler);

// Tambah gambar ke produk yang sudah ada
router.post("/:id/images", uploadMultiple, addImagesHandler);

// Hapus satu gambar dari gallery
router.delete("/images/:imageId", deleteImageHandler);

export default router;
