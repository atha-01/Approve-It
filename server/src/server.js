import dotenv from 'dotenv';
import dns from "node:dns";
import app from "./app.js";
dotenv.config();

async function startServer(){
dns.setServers(["1.1.1.1", "8.8.8.8"]);
app.listen(2000,()=>{
    console.log("server Running at port 2000")
})
}

startServer();