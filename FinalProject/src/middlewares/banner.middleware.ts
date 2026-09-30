

import multer from "multer";
import { AppError } from "../errors/AppError.js";

const MAX_FILE_SIZE =   10 * 1024 * 1024;

export const uploadBannerImg = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE
  }, fileFilter: (_req, file, callback) => {
    if(!file.mimetype.startsWith('image/')){
      callback(new AppError(400, 'only image upload is allowed'))
      return
    }
    callback(null, true);
  }
})


export const uploadSingleBannerImage = uploadBannerImg.single('image');