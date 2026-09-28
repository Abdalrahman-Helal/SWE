

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

  // list 
  // redis lists are ordered collections of strings, they can be used as a queue or stack

  const listKey = "demo:messages";
  // await redis.lPush(listKey,"hello") // lpush adds an element to the left of the list
  // await redis.rPush(listKey,"hi, redis"); // r push adds an element to the right of the list

  const extractMessages = await redis.lRange(listKey, 0, -1);
  console.log(extractMessages);

  // lTrim can be used to trim the list to a specific range
  await redis.lTrim(listKey, 0, 2);


  // set unique collection of strings, no duplicates allowed
  const setKey = "demo:tags";

  await redis.sAdd(setKey, "nodejs");
  await redis.sAdd(setKey, "nextjs");
  await redis.sAdd(setKey, "nextjs"); // duplicate will be ignored

  const tagCount = await redis.sCard(setKey);
  console.log("tag count", tagCount); // will print 2

  const rankKey = "demo:leaderboard";
  // sorted set, each member has a score, members are ordered by score
  await redis.zAdd(rankKey, [
    { score: 100, value: "Alice" },
    { score: 200, value: "Bob" },
    { score: 150, value: "Charlie" },
  ]);

  const newScore = await redis.zIncrBy(rankKey, 50, "Alice");
  console.log("new score", newScore);

  const rank = await redis.zRevRank(rankKey, "Bob"); // zRevRank returns the rank of the member in the sorted set, with the highest score being rank 0
  console.log("Bob's rank", rank);
}


run().catch(error => {
  console.error("Demo failed", error);
  process.exit(1)
});