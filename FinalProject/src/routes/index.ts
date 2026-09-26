// index.ts combines all the routes and exports them as a single router for the application.

// pluging all the routes into a single router

import { Router } from "express"; 

import { healthRouter } from "./healthRoute.js";
import { authRouter } from "./auth.routes.js";

export const apiRouter = Router();


apiRouter.use(healthRouter);
apiRouter.use('/auth', authRouter)
