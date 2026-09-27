import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createUserTask, deleteUserTask, getUserTaskById, getUserTasks, updateUserTask } from "../services/user.task.service.js";


export const userTaskRouter = Router();

/* userTaskRouter.use(authenticate)  // now all the routes below are protected

  userTaskRouter.post('/', authenticate, async(req, res, next) => {} // route 1 
  userTaskRouter.post('/',async(req, res, next) => {} // route 2

*/

userTaskRouter.use(authenticate)  // now all the routes below are protected


userTaskRouter.post('/', async(req, res, next) => {
  try{
    const task = await createUserTask(req.user!.userId , req.body.title)
    res.status(201).json({
      success: true,
      data: {
        task,
      },
    })
  }catch(error){
    next(error)
  }
})


userTaskRouter.get('/',authenticate, async(req, res,next) => {
  try{
    const tasks = await getUserTasks(req.user!.userId);
    res.status(200).json({
      success: true, 
      data: {tasks}
    })
  }catch(error){
    next(error)
  }
})

userTaskRouter.get('/:taskId', authenticate , async(req, res, next) => {
  try{
    const task = await getUserTaskById(req.user!.userId, req.params.taskId);
    res.status(200).json({
      success: true,
      data: {task}
    })
  }catch(error){
    next(error)
  }
})

userTaskRouter.patch('/:taskId', async(req, res, next) => {
  try{
    const task = await updateUserTask(req.params.taskId, req.user!.userId, req.body.title);
    res.status(200).json({
    success: true,
    data: {task}
    })
  }catch(error){
    next(error);
  }
});

userTaskRouter.delete('/:taskId', async(req , res , next) => {
  try{
    await deleteUserTask(req.params.taskId, req.user!.userId)
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully from DB'
    })

  }catch(error){
    next(error)
  }
});


