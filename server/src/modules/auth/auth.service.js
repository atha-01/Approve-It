// Checks the email, hashes the password, and creates the user.
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import bcrypt from "bcrypt";

export async function registerUser(name, email, password) {                    // this function sends the registered data to the backend

    const existingUser = await User.findOne({ email: email })                  // checks if there is a user in DB whose email matches new email entered
    if (existingUser) {
        const error = new Error("user with this email already exists")
        error.statusCode = 409;
        throw error
    }
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound)
    const newUser = await User.create({
        name: name,
        email: email,
        passwordHash: passwordHash,
        role: "student",
    })


    return {
        name: newUser.name,
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
    }
}

export async function loginUser(email, password) {
    const loggedUser = await User.findOne({ email: email })  // if emails dont match , the user doesnt exist , create a new accc
    if (!loggedUser) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error
    }
    const isPasswordValid = await bcrypt.compare(password, loggedUser.passwordHash)
    if (!isPasswordValid) {         //if the passwords don't match try again , incorrect entry
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error
    }
    const token = jwt.sign(
        {
            userId: loggedUser._id,
            role: loggedUser.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        token,
        user: {
            _id: loggedUser._id,
            name: loggedUser.name,
            email: loggedUser.email,
            role: loggedUser.role
        }
    };
}
