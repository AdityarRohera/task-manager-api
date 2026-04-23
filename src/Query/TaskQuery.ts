import { pool } from "../config/dbConnect";
import { QueryResult } from "pg";
import * as TaskTypes from "../types/task.type"
import { normalizeEnum } from "../helper/centreValidation";

// Getting single task by title
export const findSingleTaskQuery = async(title : string , userId : string) => {
    const query = `
        SELECT * FROM task
        WHERE "TITLE" = $1 AND "CREATEDBY" = $2;
    `
    return await pool.query(query , [title , userId])
}



// create new task
export const createTaskQuery = async ({title , desc, priorty, assigneeId, userId} : TaskTypes.NewTaskType) : Promise<QueryResult> => {
  const query = `
    INSERT INTO task
    ("TITLE", "DESCRIPTION", "PRIORTY" , "ASSIGNED_TO", "CREATEDBY")
    VALUES ($1, $2, $3 ,$4 , $5)
    RETURNING *;
  `;

  return await pool.query(query, [title, desc, priorty, assigneeId, userId]);
};



// Bulk Assign task to multiple users
export const addUsersToCollaborateQuery = async(taskId:string, userId:string[]) => {
    const query = `
        INSERT INTO collaborators ("TASK_ID" , "COLLAORATORS_ID")
        SELECT $1 , unnest($2::uuid[])
        RETURNING *
    `
    return await pool.query(query , [taskId , userId]);
}

// Get Alreay Assigned task user id's 
export const getCollaburatorsQuery  =  async (taskId : string , userId : string[]) : Promise<QueryResult> => {
    const query = `
        SELECT "COLLAORATORS_ID"
        FROM collaborators
        WHERE "TASK_ID" = $1
          AND "COLLAORATORS_ID" = ANY($2::uuid[])
  `;

    return pool.query(query , [taskId , userId])
}


// Get all task dynamically 
export const fetchTasks = async(userId: string, filters: any) => {
     const scope = filters.scope || "my"
     const conditions : string[] = [];
     const values : any[] = [];

     // taskQuery.ts
     const VALID_STATUS = ["TODO", "INPROGRESS", "DONE"];
     const VALID_PRIORITY = ["HIGH" , "MEDIUM" , "LOW"];
     const ALLOWED_SORT_FIELDS = ["CREATEDAT", "STATUS", "PRIORITY"];
     const ALLOWED_ORDER = ["ASC", "DESC"];

     let i = 1;

     // 🔹 Base query
     let query = `
       SELECT DISTINCT T.*
       FROM task T
       LEFT JOIN collaborators C ON C."TASK_ID" = T."TID"
     `;

      // 🔥 Scope handling
     switch (scope){
        case "assigned" :
            conditions.push(`T."ASSIGNED_TO" = $${i++}`)
            values.push(userId);
            break;

        case "contributed" :
            conditions.push(`C."COLLAORATORS_ID" = $${i++}`)
            values.push(userId)
            break;

        case "my" :
            default:
            conditions.push(`T."CREATEDBY" = $${i}`)
            values.push(userId);
            i++;
     }

     // 🔹 Optional filters
     if (filters.status) {
        const value = normalizeEnum(filters.status , VALID_STATUS , "STATUS")
        conditions.push(`T."STATUS" = $${i++}`);
        values.push(value);
     }

     if (filters.priority) {
        const value =  normalizeEnum(filters.priority , VALID_PRIORITY , "PRIORTY")
        conditions.push(`T."PRIORTY" = $${i++}`);
        values.push(value);
     }

     if (filters.created_at) {
        conditions.push(`DATE(T."CREATEDAT") = $${i++}`);
        values.push(filters.created_at);
     }

      // 🔹 WHERE
     if (conditions.length) {
       query += `WHERE ${conditions.join(" AND ")}`;
     }

     // 🔹 Sorting
     let sortBy = "CREATEDAT";
     let order = "DESC";

     if (filters.sort_by && ALLOWED_SORT_FIELDS.includes(filters.sort_by.toUpperCase())) {
        sortBy = filters.sort_by.toUpperCase();
     }

     if (filters.order && ALLOWED_ORDER.includes(filters.order.toUpperCase())) {
       order = filters.order.toUpperCase();
     }

      query += ` ORDER BY T."${sortBy}" ${order}`;

      // 🔹 Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;
     
     query += ` LIMIT $${i++} OFFSET $${i++}`;
     values.push(limit, offset);

     console.log(query)
 
     const result = await pool.query(query, values);
     return{
        data : result.rows,
        page,
        limit
     }

}