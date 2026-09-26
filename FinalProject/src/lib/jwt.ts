import { env } from "../config/env.js";
import type { TokenPayload } from "../types/user.js";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export function signAccessToken(payload: TokenPayload): string{
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions['expiresIn']
  } 

  return jwt.sign(payload, env.jwtAccessSecret, options)
}