import { NextFunction, Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { deleteFiles } from "../utils/fileHelper";
import { ParamsDictionary } from "express-serve-static-core";
import { createProduct, createProductWithImages, addProductImages, deleteProductImage, findAllProducts, updateProduct, findProductById, updateProductImage, deleteProduct } from "../services/productService";

interface ProductParams extends ParamsDictionary {
  id: string;
}

interface ImageParams extends ParamsDictionary {
  imageId: string;
}

// GET /products — semua produk dengan pagination & filter
export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await findAllProducts({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      categoryId: req.query.categoryId as string | undefined,
      search: req.query.search as string | undefined,
    });
    sendSuccess(res, result.data, "Get all products success", 200, result.meta);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request<ProductParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await findProductById(req.params.id);
    sendSuccess(res, product, "Get product success");
  } catch (error) {
    next(error);
  }
};

// POST /products — upload satu gambar
export const createProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const uploadFiles: string[] = [];

  try {
    const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const imageFile = filesObj?.["image"]?.[0] ?? req.file;

    const imagePath = imageFile ? `uploads/products/${imageFile.filename}` : undefined;

    if (imagePath) {
      uploadFiles.push(imagePath);
    }

    const files = Array.isArray(req.files) ? req.files : [];
    const imagePaths = files.map((f) => `uploads/products/${f.filename}`);

    uploadFiles.push(...imagePaths);

    const galleryFiles = filesObj?.["images"] ?? [];
    const imagesPaths = galleryFiles.map((f) => `uploads/products/${f.filename}`);

    const product =
      imagesPaths.length > 0
        ? await createProductWithImages({
            ...req.body,
            price: Number(req.body.price),
            image: imagePath,
            images: imagesPaths,
          })
        : await createProduct({
            ...req.body,
            price: Number(req.body.price),
            image: imagePath,
          });

    sendCreated(res, product, "Produk berhasil dibuat");
  } catch (error) {
    // Kalau gagal, hapus file yang sudah terupload
    if (uploadFiles.length > 0) deleteFiles(uploadFiles);
    next(error);
  }
};

// POST /products/:id/images — tambah gambar ke gallery
export const addImagesHandler = async (req: Request<ProductParams>, res: Response, next: NextFunction): Promise<void> => {
  const uploadedFiles: string[] = [];

  try {
    const files = Array.isArray(req.files) ? req.files : [];
    const imagePaths = files.map((f) => `uploads/products/${f.filename}`);

    uploadedFiles.push(...imagePaths);

    const product = await addProductImages(req.params.id, imagePaths);
    sendSuccess(res, product, "Gambar berhasil ditambahkan");
  } catch (error) {
    if (uploadedFiles.length > 0) deleteFiles(uploadedFiles);
    next(error);
  }
};

export const updateProductHandler = async (req: Request<ProductParams>, res: Response, next: NextFunction): Promise<void> => {
  const uploadedFiles: string[] = [];
  try {
    const imagePath = req.file ? `uploads/products/${req.file.filename}` : undefined;

    if (imagePath) uploadedFiles.push(imagePath);

    const updatedData = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
    };

    const product = imagePath ? await Promise.all([updateProduct(req.params.id, updatedData), updateProductImage(req.params.id, imagePath)]).then(([, updated]) => updated) : await updateProduct(req.params.id, updatedData);

    sendSuccess(res, product, "Updated product successfully");
  } catch (error) {
    if (uploadedFiles.length > 0) deleteFiles(uploadedFiles);
    next(error);
  }
};

// DELETE /products/images/:imageId — hapus satu gambar dari gallery
export const deleteImageHandler = async (req: Request<ImageParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteProductImage(req.params.imageId);
    sendSuccess(res, null, "Gambar berhasil dihapus");
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (req: Request<ProductParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteProduct(req.params.id);
    sendSuccess(res, null, "Deleted product successfully");
  } catch (error) {
    next(error);
  }
};
