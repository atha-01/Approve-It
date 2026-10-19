import express from 'express'
import authRouter from "./modules/auth/auth.routes.js";
import ideaRouter from "./modules/ideas/idea.routes.js"
const app = express();
app.use(express.json())
app.use("/api/auth", authRouter);
app.use("/api/ideas",ideaRouter)
app.get("/",(req,res)=>{
    res.send("hello")
})


export default app;