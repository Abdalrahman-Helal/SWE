// index.ts combines all the routes and exports them as a single router for the application.

// pluging all the routes into a single router

import { Router } from "express"; 

import { healthRouter } from "./healthRoute.js";
import { authRouter } from "./auth.routes.js";
import { userTaskRouter } from "./user.task.routes.js";
import { adminRouter } from "./admin.task.routes.js";
import { adminBannerRouter } from "./admin.banner.route.js";

export const apiRouter = Router();


apiRouter.use(healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/tasks', userTaskRouter);
apiRouter.use('/admin/tasks', adminRouter);

apiRouter.use('/admin/banners', adminBannerRouter)