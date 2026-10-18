//Receives request data and sends the HTTP response.
import { registerUser, loginUser } from "./auth.service.js";



export async function registration(req, res) {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
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

        if (password.length < 8) {
            return res.status(400).json({
                message: "The Password must be at least of 8 characters"
            });
        }

        const userRegistered = await registerUser(name, email, password);

        return res.status(201).json(userRegistered);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: statusCode === 409 ? error.message : "Internal server error"
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and Password required"
            });
        }

        const userLoggedIn = await loginUser(email.trim().toLocaleLowerCase(), password);


    return res.status(200).json(userLoggedIn);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: statusCode === 401 ? error.message : "Internal server error"
        });
    }
}