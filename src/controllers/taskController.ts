import type { Request , Response } from "express"
import type { AuthenticatedRequest } from "../middleware/auth";
import * as taskService from "../services/taskService";
import * as UserService from "../services/userService"

 type Task_Status_Type = 'TODO' | 'INPROGESS' | 'DONE';
 type priority_type = 'LOW' | 'MEDIUM' | 'HIGH';

export const createNewTaskHandler = async(req : Request , res : Response) => {

        console.log("Inside createTaskHandler");

    try{
        const {userId} = (req as AuthenticatedRequest).user;
        const {title , desc , priorty , assigneeId} =req.body;

        // validate title , desc , priorty , assigneeId

         // basic validation for assignee
        if(!assigneeId || typeof assigneeId !== "string"){
            return res.status(400).json({
                status : false,
                message : "Assignee id required"
            })
        }

        // find assignee
        const assigneeUser = await UserService.getUserById(assigneeId);
        if(!assigneeUser){
            return res.status(400).json({
                status : false,
                message : "Invalide assignee id"
            })
        }


        // check task already created or not
        const task = await taskService.findTask(title , userId);
        if(task){
            return res.status(400).json({
                status : false,
                message : "This task Already Created"
            })
        }

        
        // create new task 
        const NewTask = await taskService.createTask({title , desc , priorty, assigneeId, userId});
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



export const addCollaburatorsHandler = async(req : Request , res : Response) => {

        console.log("Inside Assign task to user handler")
    try{


        const {userId} = (req as AuthenticatedRequest).user;
        console.log(userId);
        const {userIds , taskId} = req.body;

        // validate task id
        // const taks


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


        // handle if user already collaborating to task
        const alreadyCollaboratingUsers = await taskService.getCollaborators(taskId , validUserIds);
        console.log("Getting alreay assigned users _____________ -> " , alreadyCollaboratingUsers);
        if(alreadyCollaboratingUsers.length === validUserIds.length){
            return res.status(400).json({
                status : false,
                invalidUserIdsCount : invalidUserIds.length,
                invalidUserIds : invalidUserIds,
                message : "These users already collaborating to this task"
            })
        }

        // now remainng users have i have to assign task
        const alreadyCollaboratingUserSet = new Set(alreadyCollaboratingUsers);
        const newUsersToCollaborate = validUserIds.filter(
            (id : any) => !alreadyCollaboratingUserSet.has(id)
        )

        
        const result = await taskService.assignToCollaborate(taskId , newUsersToCollaborate);
        return res.status(200).json({
            status : true,

            invalidIdsCount : invalidUserIds.length,
            invalidIds : invalidUserIds,

            alreadyCollaboratingUsersCount : alreadyCollaboratingUsers.length,
            alreadyCollaboratingUserIds : alreadyCollaboratingUsers,

            AssigncollaboratorsCount: result.length,
            Assigncollaborators : result
        })


    } catch(err){
        console.log("Error comes in assign users to collaborate" , err)

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


// Dynamic get users task handler
export const fetchTaskHandler = async(req : Request , res : Response) => {
    
    console.log("Inside Fetching task based on query");

    try{

        const {userId} = (req as AuthenticatedRequest).user;

        const filters = {
          scope: req.query.scope as string,
          status: req.query.status as string,
          priority: req.query.priority as string,
          created_at: req.query.created_at as string,

          page: Number(req.query.page) || 1,
          limit: Number(req.query.limit) || 10,

          sort_by: req.query.sort_by as string,
          order: req.query.order as string
        };

        // PAGINATION PENDING

        const tasks = await taskService.getTasks(userId, filters);

        return res.status(200).json({
          success: true,
          data: tasks.data,
          page : tasks.page,
          limit : tasks.limit
        });


    } catch(err){
        console.log("Error comes in get task handler" , err)

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