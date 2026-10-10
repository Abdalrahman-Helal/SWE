

import { Router } from "express"
import { authenticate } from "../middlewares/auth.middleware.js"
import { requireAdmin } from "../middlewares/admin.middleware.js";
import { uploadSingleBannerImage } from "../middlewares/banner.middleware.js";
import { createAdminBannerService, deleteAdminBannerService, fetchAllAdminBanners } from "../services/admin.banner.service.js";



export const adminBannerRouter = Router()

adminBannerRouter.use(authenticate, requireAdmin);

adminBannerRouter.post('/', uploadSingleBannerImage,  async(req, res, next) => {
  try{
    const banner = await createAdminBannerService(req.file);
    res.status(201).json({
      success: true,
      data: { banner },
    });
  }catch(error){
    next(error)
  }
});


adminBannerRouter.get('/', async(req, res, next) => {
  try{
    const banners = await fetchAllAdminBanners();
    res.status(200).json({
      success: true,
      data: { banners },
    });

  }
  catch(error){
    next(error)
  }
});


adminBannerRouter.delete('/:bannerId', async(req, res, next) => {
  try{

    await deleteAdminBannerService(req.params.bannerId)

    res.status(200).json({
      success: true,
      message: 'banner deleted succesfully'
    })
  }catch(err){
    next(err)
  }
})
