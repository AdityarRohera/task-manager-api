
import express from 'express';
const userRoute = express.Router();
import { signup , login } from '../controllers/userController';

userRoute.post('/register' , signup);
userRoute.post('/login' , login);

export default userRoute;