import express from 'express'
import { registerUser } from './auth.controller.js';



const router = express.Router();
const authRouter = router.post("/register",registerUser)


export default authRouter;