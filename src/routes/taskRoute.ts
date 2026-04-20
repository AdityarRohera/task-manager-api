import express from 'express';
import * as TaskController from "../controllers/taskController"
import { userAuth } from '../middleware/auth';
const taskRoute = express.Router();


taskRoute.use(userAuth);

taskRoute.post('/create_task' , TaskController.createNewTaskHandler);
taskRoute.post('/assign_task' , TaskController.assignTaskToUsers);

export default taskRoute;