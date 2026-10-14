// Checks the email, hashes the password, and creates the user.

import { User } from "./user.model.js";
import bcrypt from "bcrypt";

export async function registerUser(name, email, password) {
    
    const existingUser = await User.findOne({ email: email })                  // checks if there is a user in DB whose email matches new email entered
    if(existingUser){
        throw new Error ("User with this Email already exists !");
    }
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password,saltRound)
    const newUser = await User.create({
        name :name,
        email : email,
        passwordHash: passwordHash,
        role: "student",
    })
}