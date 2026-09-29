
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisURL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = createClient({ url: redisURL });

// cache key

const cacheKey = "demo:products";
const cacheTtlSeconds = 60; // cache expires after 60 seconds

let dbProducts = ["keyboard", "Mouse", "Laptop"];

async function run() {
  await redis.connect();

  // Cache-Aside: check the cache first

  let cached = await redis.get(cacheKey);

  // Cache Hit: use the cached data
  if (cached) {
    console.log("cache HIT");
    console.log(JSON.parse(cached));
  } else {
    // Cache Miss: fetch data from the database
    console.log("cache MISS");

    // fetch data from database
    const products = dbProducts;

    // store the products in cache with a 60-second TTL
    await redis.setEx(cacheKey, cacheTtlSeconds, JSON.stringify(products));
  }

  // simulate a database update
  dbProducts = ["keyboard", "Mouse", "Laptop", "Desktop"];
  console.log("database updated", dbProducts);

  // stale cache: cache still contains the old data
  cached = await redis.get(cacheKey)
  console.log('cached data',JSON.parse(cached!));

  // cache invalidation: delete the stale cache
  await redis.del(cacheKey);
  console.log("cache cleared");

  // next request will be a Cache Miss and update the cache
  cached = await redis.get(cacheKey);
  if(!cached){
    console.log("cache datra after delete");

    // get the fresh data from the database
    const freshProducts = dbProducts;

    // update the cache with the new data
    await redis.setEx(cacheKey, cacheTtlSeconds, JSON.stringify(freshProducts));

    console.log("cache updated with new data", freshProducts);
  }
  

  await redis.quit();
}


run().catch((error) => {
  console.error("caching demo failed", error);
});

