import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()
const pool=mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
}).promise()

export async function getData(){
    const [result]=await pool.query("Select * from auth")
    return result
}

export async function putData(username,password,email){
    const [result]=await pool.query("INSERT into auth(username,password,email) values(?,?,?)",[username,password,email])
    return result
}