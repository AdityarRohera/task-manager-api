
import { pool } from "../config/dbConnect";
import * as UserQuery from "../Query/UserQuery"
import { GetUserByEmailQuery, NewUserQuery } from "../Query/UserQuery";

export const findUserByEmail = async(email : string) => {
    return await pool.query(GetUserByEmailQuery , [email])
}

export const createUser = async({name , email , password} : any) => {
    return await pool.query(NewUserQuery , [name , email , password])
}

export const getUserById =async(userId : string) => {
    const result = await UserQuery.GetUserBYIdQuery(userId);
    return result.rows[0] || null;
}

export const getValidUsers = async(uniqueIds : string[]) => {
    const users = await UserQuery.getValidUsersQuery(uniqueIds);
    return users.rows.map(value => value.UID)
}