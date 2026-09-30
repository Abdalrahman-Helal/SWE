import dotenv from "dotenv";
import { createClient } from "redis";
import { redisClient } from "../redis/client";
import { json } from "stream/consumers";

dotenv.config();

const redisURL = process.env.REDIS_URL || "redis://localhost:6379";

const notification_channel = 'notifcations';

export interface NotificationsPayload {
  id: string,
  title: string,
  message: string,
  createdAt: string
}

export async function publishNotification(noti:NotificationsPayload):Promise<void> {
  await redisClient.publish(notification_channel, JSON.stringify(noti));
}

const subscriberClient = createClient({url: redisURL});

subscriberClient.on('error',(err) => {
  console.error('subs redis error', err);
})


async function startNotificationSubscriber() {
  await subscriberClient.connect();

  await subscriberClient.subscribe(notification_channel, (message) => {
    try{
      const notification = JSON.parse(message) as NotificationsPayload;

      console.log('New notification received');
      console.log('title', notification.title);
      console.log('message', notification.message);
      console.log('created at', notification.createdAt);
    }catch{
      console.log('New notification received (new)', message);
    }
  })
}


startNotificationSubscriber().catch((error) => {
  console.error('failed to start notification', error);
  process.exit(1);
});