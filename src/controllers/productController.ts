import { NextFunction, Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { deleteFiles } from "../utils/fileHelper";
import { createProduct, createProductWithImages, addProductImages, deleteProductImage } from "../services/productService";

// POST /products — upload satu gambar
export const createProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const imagePath = req.file ? `uploads/products/${req.file.filename}` : undefined;

    const product = await createProduct({
      ...req.body,
      price: Number(req.body.price), // form-data selalu string, konversi dulu
      image: imagePath,
    });

    sendCreated(res, product, "Produk berhasil dibuat");
  } catch (error) {
    // Kalau gagal, hapus file yang sudah terupload
    if (req.file) deleteFiles([`uploads/products/${req.file.filename}`]);
    next(error);
  }
};

// POST /products/gallery — upload banyak gambar
export const createProductWithGalleryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const imagePaths = files?.map((f) => `uploads/products/${f.filename}`) ?? [];

    const product = await createProductWithImages({
      ...req.body,
      price: Number(req.body.price),
      images: imagePaths,
    });

    sendCreated(res, product, "Produk dengan gallery berhasil dibuat");
  } catch (error) {
    // Kalau gagal, hapus semua file yang sudah terupload
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      deleteFiles(files.map((f) => `uploads/products/${f.filename}`));
    }
    next(error);
  }
};

// POST /products/:id/images — tambah gambar ke gallery
export const addImagesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const imagePaths = files?.map((f) => `uploads/products/${f.filename}`) ?? [];

    const product = await addProductImages(req.params.id, imagePaths);
    sendSuccess(res, product, "Gambar berhasil ditambahkan");
  } catch (error) {
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      deleteFiles(files.map((f) => `uploads/products/${f.filename}`));
    }
    next(error);
  }
};

// DELETE /products/images/:imageId — hapus satu gambar dari gallery
export const deleteImageHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteProductImage(req.params.imageId);
    sendSuccess(res, null, "Gambar berhasil dihapus");
  } catch (error) {
    next(error);
  }
};
