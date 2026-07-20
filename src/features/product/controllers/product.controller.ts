import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { catchAsync } from "@/utils/catchAsync";
import { sendSuccess, sendCreated } from "@/utils/response";
import { deleteFiles } from "@/utils/fileHelper";

const getFilePath = (file?: Express.Multer.File): string | undefined => {
  return file ? `uploads/products/${file.filename}` : undefined;
};

const getFilePaths = (files: Express.Multer.File[]): string[] => {
  return files.map((f) => `uploads/products/${f.filename}`);
};

export class ProductController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const categoryId = req.query.categoryId as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await ProductService.getProducts({
      page,
      limit,
      categoryId,
      search,
    });

    sendSuccess(res, result.data, "Get all products successfully.", 200, result.meta);
  });

  static getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const product = await ProductService.getProductById(req.params.id);
    sendSuccess(res, product, "Get product by id successfully.");
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const uploadedFiles: string[] = [];
    try {
      const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const imageFile = filesObj?.["image"]?.[0] ?? (Array.isArray(req.files) ? req.files[0] : req.file);
      const imagePath = getFilePath(imageFile);

      if (imagePath) uploadedFiles.push(imagePath);

      const galleryFiles = filesObj?.["images"] ?? [];
      const imagesPaths = getFilePaths(galleryFiles);
      uploadedFiles.push(...imagesPaths);

      const newProduct = await ProductService.createProduct({
        ...req.body,
        price: Number(req.body.price), // Cast price to number as Express forms send it as string
        image: imagePath,
        images: imagesPaths.length > 0 ? imagesPaths : undefined,
      });

      sendCreated(res, newProduct, "Create new product is successfully.");
    } catch (error) {
      if (uploadedFiles.length > 0) deleteFiles(uploadedFiles);
      throw error;
    }
  });

  static update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const uploadedFiles: string[] = [];
    try {
      const imagePath = getFilePath(req.file);
      if (imagePath) uploadedFiles.push(imagePath);

      const updatedProduct = await ProductService.updateProduct(req.params.id, {
        ...req.body,
        ...(req.body.price !== undefined && { price: Number(req.body.price) }), // Cast price if sent
        image: imagePath,
      });

      sendSuccess(res, updatedProduct, "Update product is successfully.");
    } catch (error) {
      if (uploadedFiles.length > 0) deleteFiles(uploadedFiles);
      throw error;
    }
  });

  static delete = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    await ProductService.deleteProduct(req.params.id);
    sendSuccess(res, null, "Delete product is successfully.");
  });

  static addImages = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const uploadedFiles: string[] = [];
    try {
      const files = Array.isArray(req.files) ? req.files : [];
      const imagePaths = getFilePaths(files);
      uploadedFiles.push(...imagePaths);

      const product = await ProductService.addProductImages(req.params.id, imagePaths);
      sendSuccess(res, product, "Gambar berhasil ditambahkan");
    } catch (error) {
      if (uploadedFiles.length > 0) deleteFiles(uploadedFiles);
      throw error;
    }
  });

  static deleteImage = catchAsync(async (req: Request<{ imageId: string }>, res: Response) => {
    await ProductService.deleteProductImage(req.params.imageId);
    sendSuccess(res, null, "Gambar berhasil dihapus");
  });
}
