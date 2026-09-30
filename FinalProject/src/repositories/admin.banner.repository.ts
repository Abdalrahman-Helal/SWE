import { pool } from "../lib/db.js";
import type { Banner } from "../types/banner.js";

export async function createAdminBanner(
  imgUrl: string,
  cloudinaryPublicId: string
): Promise<Banner> {
  const result = await pool.query<BannerRow>(
    `INSERT INTO banners (img_url, cloudinary_public_id)
    VALUES ($1, $2)
    RETURNING id, img_url, cloudinary_public_id, created_at, updated_at`,
    [imgUrl, cloudinaryPublicId]
  );

  return result.rows[0];
}