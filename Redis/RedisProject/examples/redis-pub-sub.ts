

// publish / subscribe example using redis

// publisher sends a message to a channel, and subscriber listens to that channel and receives the message
// channel is the topic name


import dotenv from "dotenv";
import { resolve } from "path";
import { title } from "process";
import { createClient } from "redis";

dotenv.config();

const redisURL = process.env.REDIS_URL || "redis://localhost:6379";

const channel = "demo:notifications"

async function run() {
  // needs two clients, one for publishing and one for subscribing
  const publisher = createClient({url: redisURL});
  const subscriber = createClient({url: redisURL});

  await publisher.connect();
  await subscriber.connect();

  console.log('publisher connected');
  console.log('subscriber connected');
  
  console.log('ping ->', await publisher.ping());
  console.log('subscribe listens');

  // subscriber must be active before publisher sends a message

  await subscriber.subscribe(channel, (message) => {
    const data = JSON.parse(message);
    console.log('subscriber received');
    console.log('title', data.title);
    console.log('message', data.message)
  });

  console.log('Subscribed to channel', channel)

  // publisher 
  console.log('Publisher is now sending an event');
  const event = {
    title: 'redis course',
    message: 'pub/sub demo'
  }

  const receivers = await publisher.publish(channel, JSON.stringify(event));
  console.log('published an event');
  console.log('active subscribers', receivers);

  await new Promise((resolve) => setTimeout(resolve,300))

  await subscriber.unsubscribe(channel);
  await subscriber.quit();
  await publisher.quit();

  console.log('pub/sub demo done');
}

run().catch((error) => {
  console.error("caching demo failed", error);
});