import type { Request , Response } from "express"
import type { AuthenticatedRequest } from "../middleware/auth";
import * as taskService from "../services/taskService";
import * as UserService from "../services/userService"

export const createNewTaskHandler = async(req : Request , res : Response) => {

        console.log("Inside createTaskHandler");

    try{
        const {userId} = (req as AuthenticatedRequest).user;
        const {title , desc} =req.body;

        // validate task

        // check task already created or not
        const task = await taskService.findTask(title , userId);
        if(task){
            return res.status(400).json({
                status : false,
                message : "This task Already Created"
            })
        }

        
        // create new task 
        const NewTask = await taskService.createTask({title , desc , userId});
        return res.status(200).json({
            status : true,
            message : "New Task Created",
            res : NewTask
        })
        

    } catch(err){
        console.log("Error comes in createNewTaskHandler" , err)

        let errorMessage
        if(err instanceof Error){
            errorMessage = err.message
        }

        if(typeof err === "string"){
            errorMessage = err
        }

        return res.status(500).json({
            status : false,
            message : "Internal Server Error",
            err : errorMessage
        })
    }
}



export const assignTaskToUsers = async(req : Request , res : Response) => {

        console.log("Inside Assign task to user handler")
    try{

        const {userId} = (req as AuthenticatedRequest).user;
        console.log(userId);
        const {userIds , taskId} = req.body;


        // ✅ 1. Validate input
        if (!Array.isArray(userIds) || userIds.length === 0) {
          throw new Error("userIds must be non-empty array");
        }


        // ✅ 2. Remove duplicates
        const uniqueIds = [...new Set(userIds)];

        if(uniqueIds.length === 1 &&  uniqueIds.includes(userId)){
            return res.status(400).json({
                status : false,
                message : "User Cannot assign role to himself"
            })
        }

        const validUserIds = await UserService.getValidUsers(uniqueIds);
        if(validUserIds.length === 0){
            return res.status(400).json({
                status : false,
                message : "Invalid user id's"
            })
        }

        const validSet = new Set(validUserIds);

        const invalidUserIds = uniqueIds.filter(
          id => !validSet.has(id)
        );

        console.log("Before login validUsers" , validUserIds)
        if(validUserIds.includes(userId)){
            const index = validUserIds.indexOf(userId);
            validUserIds.splice(index, 1);
            invalidUserIds.push(userId);
        }

        console.log("After login validUsers" , validUserIds)

        console.log("Valid user id's" , validUserIds);
        console.log("Getting invalid id's &&&&&&&&&&&&" , invalidUserIds)


        // handle if task already assigned to user
        const alreadyAssignedUsers = await taskService.alreadyAssignedTask(taskId , validUserIds);
        console.log("Getting alreay assigned users _____________ -> " , alreadyAssignedUsers);
        if(alreadyAssignedUsers.length === validUserIds.length){
            return res.status(400).json({
                status : false,
                invalidUserIdsCount : invalidUserIds.length,
                invalidUserIds : invalidUserIds,
                message : "Task is Already assigned to these users"
            })
        }

        // now remainng users have i have to assign task
        const alreadyAssignedUserSet = new Set(alreadyAssignedUsers);
        const newUsersToAssignTask = validUserIds.filter(
            (id : any) => !alreadyAssignedUserSet.has(id)
        )

        
        const result = await taskService.assignTask(taskId , newUsersToAssignTask);
        return res.status(200).json({
            status : true,

            invalidIdsCount : invalidUserIds.length,
            invalidIds : invalidUserIds,

            alreadyAssignedUsersCount : alreadyAssignedUsers.length,
            alreadyAssignedUserIds : alreadyAssignedUsers,

            assignedTaskCount: result.length,
            assignedResult : result
        })


    } catch(err){
        console.log("Error comes in assignTaskToUsers" , err)

        let errorMessage
        if(err instanceof Error){
            errorMessage = err.message
        }

        if(typeof err === "string"){
            errorMessage = err
        }

        return res.status(500).json({
            status : false,
            message : "Internal Server Error",
            err : errorMessage
        })
    }
}