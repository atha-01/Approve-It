import pool from "./src/config/postgres.js";

import "dotenv/config"

async function connectDB (){
 try {
    const result = await pool.query("select current_database()");
    console.log(result);
 }
 catch(error){
    console.log("failed",error);
 }
 finally{
    await pool.end()
 }
}

connectDB();