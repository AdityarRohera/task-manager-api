import express from 'express';
import * as TaskController from "../controllers/taskController"
import { userAuth } from '../middleware/auth';
const taskRoute = express.Router();


taskRoute.use(userAuth);

taskRoute.post('/create_task' , TaskController.createNewTaskHandler);
taskRoute.post('/add_collaborators' , TaskController.addCollaburatorsHandler);

taskRoute.get('/tasks' , TaskController.fetchTaskHandler);

export default taskRoute;