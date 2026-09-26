import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import type { TokenPayload } from "../types/user.js";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export function signAccessToken(payload: TokenPayload): string{
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions['expiresIn']
  } 

  return jwt.sign(payload, env.jwtAccessSecret, options)
}


export function verifyAccessToken(token: string): TokenPayload{
  try{
    return jwt.verify(token, env.jwtAccessSecret)as TokenPayload;

  }catch {
    throw new AppError(401, 'Invalid or expired access token')
  }    

  }
