import { create } from "node:domain";
import { AppError } from "../errors/AppError.js"
import { uploadBannerImageToCloundinary } from "../lib/cloundinary.js";
import type { Banner } from "../types/banner.js"
import { createAdminBanner } from "../repositories/admin.banner.repository.js";
import { pool } from "../lib/db.js";

export async function createAdminBannerService(file: Express.Multer.file | undefined):Promise<Banner>{
  if(!file){
    throw new AppError(400, 'Image is required');
  }

  if(!file.buffer){
    throw new AppError(400, 'Image type is invalid');;
  }
  const {secureUrl, publicId} = await uploadBannerImageToCloundinary(
    file.buffer,
    {
      folder: "nodejs-capstone-project"
    }
  )

  if(!secureUrl || !publicId){
    throw new AppError(500, 'cloudinary error occured');
  }

  const banner = await createAdminBanner(secureUrl, publicId)

  return banner
}


export async function fetchAllAdminBanners():Promise<Banner[]>{
  const result = await findAllAdminBannersFromDB();
  return result;
}


export async function findAllAdminBannersFromDB():Promise<Banner[]>{
  const result = await pool.query<BannerRow>(
    `SELECT id, img_url, cloudinary_public_id, created_at, updated_at
    FROM banners
    ORDER BY created_at DESC`
  )
  return result.rows;
}

