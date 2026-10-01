import { create } from "node:domain";
import { AppError } from "../errors/AppError.js"
import { uploadBannerImageToCloundinary } from "../lib/cloundinary.js";
import type { Banner } from "../types/banner.js"
import { createAdminBanner, findAllAdminBannersFromDB } from "../repositories/admin.banner.repository.js";
import { pool } from "../lib/db.js";
import { clearBannerCache, getBannerFromCache, setBannerToCache } from "../lib/bannerCache.js";

export async function createAdminBannerService(file: Express.Multer.File | undefined):Promise<Banner>{
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

  // invalidate the cache after creating a new banner

  await clearBannerCache();
  
  return banner
}


export async function fetchAllAdminBanners():Promise<Banner[]>{
  const getCachedBanners = await getBannerFromCache();
  if(getCachedBanners){
    return getCachedBanners;
  }
  const banners = await findAllAdminBannersFromDB();

  // set the data to cache after fetching from database
  await setBannerToCache(banners);
  return banners;
}



