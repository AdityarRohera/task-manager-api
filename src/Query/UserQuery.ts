import { pool } from "../config/dbConnect";
import { QueryResult } from "pg";


// Find Single user by email
export const GetUserByEmailQuery = `
    SELECT * FROM users
    WHERE "EMAIL" = $1;
`;


// Find single user by id 
export const GetUserBYIdQuery = async(userId : string) => {
    const query = `
        SELECT * FROM users
        WHERE "UID" = $1; 
    `

    return await pool.query(query , [userId]);
}


// Create new user Query
export const NewUserQuery = `
    INSERT INTO users
    (
        "NAME" , "EMAIL" , "PASSWORD"
    )
    VALUES
    (
        $1 , $2 , $3
    )
`

// validate users 
export const getValidUsersQuery = async (userIds: string[]) : Promise<QueryResult> => {
  const query = `SELECT "UID" FROM users WHERE "UID" = ANY($1)`;
  return await pool.query(query, [userIds]);
};