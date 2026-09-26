

import type { Response, Request, NextFunction } from "express";
import { AppError } from "../errors/AppError.js"


export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void{
  if(req.user?.role !== 'ADMIN'){
    next(new AppError(403, 'Admin access required. You do not have admin access it seems'));
    return;
  }

  next();
}