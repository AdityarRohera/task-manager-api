


import express from 'express'
import type { Request , Response } from 'express';

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const secret = process.env.TOKEN_SECRET;

import { AuthenticatedRequest } from '../middleware/auth';
import { createUser, findUserByEmail } from '../services/userService';


// Signup controller
export async function signup(req : Request, res : Response) {
  try {
    const {name, email, password} = req.body;
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser.rowCount! > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    const user = await createUser({name , email , password : hashedPassword}) 
    return res.status(201).json({ message: 'User created successfully', user : user.rows[0]});

  } catch (error) {
    console.log("Error comes in signup user" , error)
    return res.status(500).json({ error: 'Internal server error' , errMessage :error });
  }
}

// Login controller
export async function login(req : Request, res : Response) {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await findUserByEmail(email);
    console.log(user.rows[0] , );
    if (user.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Compare the password
    const isMatch = await bcrypt.compare(password, user.rows[0].PASSWORD);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

     // now create token for user
             const token = secret ? jwt.sign({
               userId : user.rows[0].UID
             } , secret, {expiresIn: '3d'}) : null;
    
    return res.status(200).json({ message: 'Login successful', user : user.rows[0] , token});
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// export const getUserHandler = async(req : Request , res : Response) => {
//   try{
//           const AuthRequest = req as AuthenticatedRequest
//           const {userId} = AuthRequest.user
//           console.log("IsAdmin getting user id -> " , userId);

//           const user = getUser(userId);

//           return res.status(200).json({
//             success : false,
//             message : "Get user Successfully",
//             user : user
//           })

//   } catch(err){
//     return res.status(500).json({ error: 'Internal server error' , errMessage :err});
//   }
// }