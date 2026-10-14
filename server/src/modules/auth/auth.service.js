// Checks the email, hashes the password, and creates the user.

import  User  from "./user.model.js";
import bcrypt from "bcrypt";

export async function registerUser(name, email, password) {                    // this function sends the registered data to the backend

    const existingUser = await User.findOne({ email: email })                  // checks if there is a user in DB whose email matches new email entered
    if(existingUser){
        const error = new Error("user with this email already exists")
        error.statusCode = 409;
        throw error
    }
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password,saltRound)
    const newUser = await User.create({
        name :name,
        email : email,
        passwordHash: passwordHash,
        role: "student",
    })


    return {
        name : newUser.name,
        _id : newUser._id,
        email : newUser.email,
        role : newUser.role,

    }
}