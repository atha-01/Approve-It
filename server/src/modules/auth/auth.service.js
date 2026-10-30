// Checks the email, hashes the password, and creates the user , creates a user and works with db

import prisma from "../../config/prisma.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function registerUser(name, email, password) {                    // this function sends the registered data to the backend

    const existingUser = await prisma.user.findUnique({


    where: { email: email.trim().toLowerCase() }
        });     
        
        // checks if there is a user in DB whose email matches new email entered
    if (existingUser) {
        const error = new Error("user with this email already exists")
        error.statusCode = 409;
        throw error
    }
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound)
    let newUser;

    try{
        newUser = await prisma.user.create({
    data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: passwordHash,
        role: "student",
    },
});
}
    catch(error){
        if(error.code==="P2002"){
            const conflict  = new Error("user with this email already exists");
            conflict.statusCode = 409;
            throw conflict;
        }
        throw error;
    }

return {
    name: newUser.name,
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
};
}


export async function loginUser(email, password, role) {
    const loggedUser = await prisma.user.findUnique({
        where: {
            email: email.trim().toLowerCase()
        }
    });

    if (!loggedUser) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // Check whether the selected login role matches the account role.
    if (loggedUser.role !== role) {
        const error = new Error("You selected the wrong login type.");
        error.statusCode = 403;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        loggedUser.passwordHash
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            userId: loggedUser.id,
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
            id: loggedUser.id,
            name: loggedUser.name,
            email: loggedUser.email,
            role: loggedUser.role
        }
    };
}
export async function registerTeacherApplication(name,email,password){
    const searchInUserTable = await prisma.user.findUnique({
        where:{
            email:email.trim().toLowerCase(),
        }
    })
    if(searchInUserTable){
        const error = new Error("Teacher with this Email already exists");
        error.statusCode = 409;
        throw error;
    }
    const searchInTeachersTable = await prisma.teacherApplication.findUnique({
        where:{
            email:email.trim().toLowerCase(),
        }
    })
    if(searchInTeachersTable){
        const error = new Error("Teacher with this Email already exists");
        error.statusCode = 409;
        throw error;
    }
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound)
    let createTeacher ;

    try{
        createTeacher = await prisma.teacherApplication.create({
            data:{

                name: name.trim(),
                email: email.trim().toLowerCase(),
                passwordHash: passwordHash,
            }
        })
    }
    catch(error){
        if(error.code === "P2002"){
        const creationError = new Error("An application with this email already exists")
        creationError.statusCode = 409;
        throw creationError;
        }
        throw error;
       
    }
    return createTeacher ;
}