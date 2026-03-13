import fs from "fs";
import path from "path";

// Hapus file dari server
export const deleteFile = (filePath: string): void => {
  const fullPath = path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// Hapus banyak file sekaligus
export const deleteFiles = (filePaths: string[]): void => {
  filePaths.forEach(deleteFile);
};

// Build URL yang bisa diakses client
export const buildFileUrl = (req: Express.Request, filePath: string): string => {
  return `${req.protocol}://${req.get("host")}/${filePath}`;
};
