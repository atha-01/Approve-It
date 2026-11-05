import dotenv from 'dotenv';
import dns from "node:dns";
import app from "./app.js";
dotenv.config();
const PORT = process.env.PORT || 2000;
async function startServer(){
dns.setServers(["1.1.1.1", "8.8.8.8"]);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
}

startServer();