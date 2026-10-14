import express from 'express'
import { registration } from './auth.controller.js';



const router = express.Router();
//const authRouter = router.post("/register",registration)  we can just skip these steps and directly export the router 
// and then import it inside a new function under a new variable name 

router.post("/register",registration)
export default router;