

// string 
// hash
// list
// set
// sorted list
// ttl


// string store one value per key

// plain text , numbers stored as string, json objects stored as string
// key: pageview: 
// value: "1000"


import dotenv from "dotenv";

import { createClient } from "redis";


dotenv.config();

const redisURL = process.env.redisURL || "redis://localhost:6379";

const redis = createClient({ url: redisURL });

async function run() {

  //  open connection to redis server
  await redis.connect();
  console.log("Connected to Redis server");
  console.log("PING", await redis.ping());

  // strings
  const stringKey = "demo:page_views";

  await redis.set(stringKey,"100")

  const pageviews = await redis.get(stringKey);
  console.log(pageviews);
  
  // redis strings can wokr like a counter, we can increment and decrement the value of a key
  const afterIncrement = await redis.incr(stringKey);
  console.log("after increment", afterIncrement);

   // hash stores multiple key value pairs under a single key
  // key: keyname
  // field: 
  // name -> "John"
  // email -> "john@example.com"

  const hashKey = "demo:user:profile";

  await redis.hSet(hashKey, {
    name: "John",
    city: "New York",
  });

  const extractProfileInfo = await redis.hGetAll(hashKey); 
}


run().catch(error => {
  console.error("Demo failed", error);
  process.exit(1)
});