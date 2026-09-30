
import type { Request, Response , NextFunction } from "express";
import { redisClient } from "../redis/client";

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUEST = 5;

export async function productRateLimiter(req: Request , res: Response, next: NextFunction) {
  try{
   // Each IP gets a unique Redis key to track requests within the time window.
  // In production, use the real client IP from the proxy/load balancer.

    const ip = req.ip || 'unknown'
    const rateLimitKey = `rate_limit:products:${ip}`;

    const requestCount = await redisClient.incr(rateLimitKey);


    // after 60 seconds, the key will expire and the count will reset
    if(requestCount === 1){
      await redisClient.expire(rateLimitKey, RATE_LIMIT_WINDOW_SECONDS)
    }

    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUEST);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUEST - requestCount));

    if(requestCount > RATE_LIMIT_MAX_REQUEST){
      return res.status(429).json({
        success: false,
        message: 'Too many request, Please try again later'
      });
    }
    next();
  }catch(error){
    console.error('rate limit redis error', error);
    next(error)
  }
}
