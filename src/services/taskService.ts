


import { pool } from "../config/dbConnect";
import * as TaskQuery from "../Query/TaskQuery"

import * as TaskTypes from "../types/task.type"

export const findTask = async(title : string , userId : string) => {
    const result = await TaskQuery.findSingleTaskQuery(title , userId)
    return result.rows[0] || null
}

export const findSingleTask = async(taskId : string) => {
    const result = await TaskQuery.findSingleTaskBYIdQuery(taskId)
    return result.rows[0] || null
}

export const getFullTaskInfo = async(taskId : string) => {
    const result = await TaskQuery.findFullTaskInfoQuery(taskId)
    return result.rows
}

export const createTask = async({title , desc , priorty, assigneeId, userId} : TaskTypes.NewTaskType) => {
    const result = await TaskQuery.createTaskQuery({title , desc, priorty, assigneeId, userId});
    return result.rows[0];
}

export const getCollaborators = async(taskId : string , userIds : string[]) => {
    const result = await TaskQuery.getCollaburatorsQuery(taskId , userIds);
    return result.rows.map(value => value.COLLAORATORS_ID);
}


export const assignToCollaborate = async(taskId : string , userIds : string[]) => {
    const result = await TaskQuery.addUsersToCollaborateQuery(taskId , userIds);
    return result.rows;
}

// get users tasks
export const getTasks = async (userId: string, filters: any) => {
    return await TaskQuery.fetchTasks(userId, filters);
};