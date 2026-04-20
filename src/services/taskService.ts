


import { pool } from "../config/dbConnect";
import * as TaskQuery from "../Query/TaskQuery"

import * as TaskTypes from "../types/task.type"

export const findTask = async(title : string , userId : string) => {
    const result = await TaskQuery.findSingleTaskQuery(title , userId)
    return result.rows[0] || null
}

export const createTask = async({title , desc , userId} : TaskTypes.NewTaskType) => {
    const result = await TaskQuery.createTaskQuery({title , desc , userId});
    return result.rows[0];
}

export const alreadyAssignedTask = async(taskId : string , userIds : string[]) => {
    const result = await TaskQuery.getAlreadyAssignedUsersQuery(taskId , userIds);
    return result.rows.map(value => value.ASSIGNED_UID);
}


export const assignTask = async(taskId : string , userIds : string[]) => {
    const result = await TaskQuery.assignTaskToUsersQuery(taskId , userIds);
    return result.rows;
}
