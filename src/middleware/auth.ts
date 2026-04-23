


import type { Request , Response } from "express";

const secret = process.env.TOKEN_SECRET;
import jwt from 'jsonwebtoken';
import type {JwtPayload } from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
        user : JwtPayload;
        client : any;
}

export const userAuth = (req : Request , res : Response , next : Function) => {
        try{

            const userReq = req as AuthenticatedRequest;
            const {token} = req.headers;
            console.log("Inside user auth -> " , token , typeof(token))

            if(!token || typeof token!== "string"){
                return res.status(400).json({
                    success : false,
                    message : "Token Required"
                })
            
            }

            // now verify token
            const verifyToken =  jwt.verify(token , secret!) as JwtPayload

            if(!verifyToken){
            return res.status(403).json({
                success : false,
                message: "Token invalid"
            })
    
            }

            userReq.user = verifyToken;

            next();

        }catch(err : unknown){
            let errorMessage;
            if(err instanceof Error){
                errorMessage = err.message
            } else if(typeof(err) === 'string'){
                errorMessage = err
            }
            res.status(500).send({
                success : false,
                message : "Error comes in user auth",
                error : errorMessage
            })
        }
   }