import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";
import { deleteFiles } from "../utils/fileHelper";
import { createProduct, createProductWithImages, addProductImages, deleteProductImage, findAllProducts, updateProduct, findProductById, updateProductImage, deleteProduct } from "../services/productService";

/**
 * Helper: ekstrak path file dari request upload.
 */
const getFilePath = (file?: Express.Multer.File): string | undefined => {
  return file ? `uploads/products/${file.filename}` : undefined;
};

const getFilePaths = (files: Express.Multer.File[]): string[] => {
  return files.map((f) => `uploads/products/${f.filename}`);
};

/**
 * GET /products — Semua produk (pagination, filter category & search).
 */
export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await findAllProducts({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    categoryId: req.query.categoryId as string | undefined,
    search: req.query.search as string | undefined,
  });
  sendSuccess(res, result.data, "Get all products success", 200, result.meta);
});

/**
 * GET /products/:id — Detail produk.
 */
export const getProductById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const product = await findProductById(req.params.id);
  sendSuccess(res, product, "Get product success");
});

/**
 * POST /products — Buat produk baru (dengan upload gambar).
 */
export const createProductHandler = catchAsync(async (req: Request, res: Response) => {
  const uploadedFiles: string[] = [];

  try {
    const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const imageFile = filesObj?.["image"]?.[0] ?? (Array.isArray(req.files) ? req.files[0] : req.file);
    const imagePath = getFilePath(imageFile);

    if (imagePath) uploadedFiles.push(imagePath);

    const galleryFiles = filesObj?.["images"] ?? [];
    const imagesPaths = getFilePaths(galleryFiles);
    uploadedFiles.push(...imagesPaths);

    const productData = {
      ...req.body,
      price: Number(req.body.price),
      image: imagePath,
    };

    const product =
      imagesPaths.length > 0
        ? await createProductWithImages({ ...productData, images: imagesPaths })
        : await createProduct(productData);

    sendCreated(res, product, "Produk berhasil dibuat");
  } catch (error) {
    if (uploadedFiles.length > 0) deleteFiles(uploadedFiles);
    throw error;
  }
});

/**
 * POST /products/:id/images — Tambah gambar ke gallery.
 */
export const addImagesHandler = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const uploadedFiles: string[] = [];

  try {
    const files = Array.isArray(req.files) ? req.files : [];
    const imagePaths = getFilePaths(files);
    uploadedFiles.push(...imagePaths);

    const product = await addProductImages(req.params.id, imagePaths);
    sendSuccess(res, product, "Gambar berhasil ditambahkan");
  } catch (error) {
    if (uploadedFiles.length > 0) deleteFiles(uploadedFiles);
    throw error;
  }
});

/**
 * PUT /products/:id — Update produk & gambar utama.
 */
export const updateProductHandler = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const uploadedFiles: string[] = [];

  try {
    const imagePath = getFilePath(req.file);
    if (imagePath) uploadedFiles.push(imagePath);

    const updatedData = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
    };

    const product = imagePath
      ? await updateProduct(req.params.id, updatedData).then(() =>
          updateProductImage(req.params.id, imagePath),
        )
      : await updateProduct(req.params.id, updatedData);

    sendSuccess(res, product, "Updated product successfully");
  } catch (error) {
    if (uploadedFiles.length > 0) deleteFiles(uploadedFiles);
    throw error;
  }
});

/**
 * DELETE /products/images/:imageId — Hapus satu gambar gallery.
 */
export const deleteImageHandler = catchAsync(async (req: Request<{ imageId: string }>, res: Response) => {
  await deleteProductImage(req.params.imageId);
  sendSuccess(res, null, "Gambar berhasil dihapus");
});

/**
 * DELETE /products/:id — Hapus produk beserta semua gambar.
 */
export const deleteProductHandler = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  await deleteProduct(req.params.id);
  sendSuccess(res, null, "Deleted product successfully");
});
