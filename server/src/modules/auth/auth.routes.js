import express from 'express'
import { registration } from './auth.controller.js';
import { login } from './auth.controller.js';
import { auth } from "../../middleware/auth.js";



const router = express.Router();
//const authRouter = router.post("/register",registration)  we can just skip these steps and directly export the router 
// and then import it inside a new function under a new variable name 
router.get("/me", auth, (req, res) => {
    return res.status(200).json({ user: req.user });
});
router.post("/register",registration);
router.post("/login", login);
export default router;