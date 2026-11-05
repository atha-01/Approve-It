import express from 'express'
import authRouter from "./modules/auth/auth.routes.js";
import ideaRouter from "./modules/ideas/idea.routes.js"
import adminRouter from "./modules/admin/admin.routes.js"
import  searchRouter  from './modules/search/search.routes.js';
const app = express();
app.use(express.json())
app.use("/api/auth", authRouter);
app.use("/api/ideas",ideaRouter)
app.use("/api/admin",adminRouter);
app.use("/api/search",searchRouter)
app.get("/",(req,res)=>{
    res.send("hello")
})


export default app;