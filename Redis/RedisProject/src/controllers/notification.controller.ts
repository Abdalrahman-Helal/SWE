
import type { Request, Response , NextFunction } from "express";
import { publishNotification } from "../subscribers/notification.subscriber";



export async function publishNotificationController( req: Request, res: Response, next: NextFunction) {
  try{
    const { title, message } = req.body;

    const notifcations = {
      id: Date.now().toString(),
      title,
      message,
      createdAt: new Date().toISOString()
    }

    //publisher is going to publish 
    await publishNotification(notifcations);

    res.status(201).json({
      success: true,
      message: "Notification published successfully",
      data: {
        id: notifcations.id,
      }
    });

  } catch(error){
    next(error);
  }
}