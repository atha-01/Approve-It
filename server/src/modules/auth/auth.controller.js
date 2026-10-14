//Receives request data and sends the HTTP response.

import { registerUser } from "./auth.service.js"
export async function registration(req, res) {
    try{
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        // Validate required fields and their data types

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        if (password.length<8){
            return res.status(400).json({
                message: "The Password must be at least of 8 characters"
            });
        }



        const userRegistered = await registerUser(          // this registers the user into the db
        name , email , password
    )
    
        res.status(201).json(userRegistered)
    }
    catch(error){
        const statusCode = error.statusCode ||500 ;
        res.status(statusCode).json({
        message: statusCode === 409
            ? error.message
            : "Internal server error"
    });
    }
    
}