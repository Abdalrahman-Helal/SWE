import {createClient} from "redis";
import { log } from "util";

const redisURL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({url: redisURL});

redisClient.on("connect", () => {
  console.log("redis client connected");
})

redisClient.on("ready", () => {
  console.log("redis client ready");
})

redisClient.on("error", (error) => {
  console.log("redis client error", error);
})

redisClient.on("end", () => {
  console.log("redis client connection closed");
})




export async function connectRedis(): Promise<void> {
  if(!redisClient.isOpen) {
    await redisClient.connect();
  }

  const pong = await redisClient.ping();
  console.log('redis ping response' , pong);
}


export async function disconnectRedis(): Promise<void> {
  if(redisClient.isOpen){
    await redisClient.quit();
  }
}