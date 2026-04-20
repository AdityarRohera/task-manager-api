import { pool } from "../config/dbConnect";
import { QueryResult } from "pg";
import * as TaskTypes from "../types/task.type"
import { title } from "node:process";

// Getting single task by title
export const findSingleTaskQuery = async(title : string , userId : string) => {
    const query = `
        SELECT * FROM task
        WHERE "TITLE" = $1 AND "CREATEDBY" = $2;
    `
    return await pool.query(query , [title , userId])
}



// create new task
export const createTaskQuery = async ({title , desc , userId} : TaskTypes.NewTaskType) : Promise<QueryResult> => {
  const query = `
    INSERT INTO task
    ("TITLE", "DESCRIPTION", "CREATEDBY")
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  return await pool.query(query, [title, desc, userId]);
};



// Bulk Assign task to multiple users
export const assignTaskToUsersQuery = async(taskId : string ,userId : string[]) => {
    const query = `
        INSERT INTO Assigned ("TID" , "ASSIGNED_UID")
        SELECT $1 , unnest($2::uuid[])
        RETURNING *
    `
    return await pool.query(query , [taskId , userId]);
}

// Get Alreay Assigned task user id's 
export const getAlreadyAssignedUsersQuery  =  async (taskId : string , userId : string[]) : Promise<QueryResult> => {
    const query = `
        SELECT "ASSIGNED_UID"
        FROM Assigned
        WHERE "TID" = $1
          AND "ASSIGNED_UID" = ANY($2::uuid[])
  `;

    return pool.query(query , [taskId , userId])
}