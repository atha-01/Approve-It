
import prisma from "../../config/prisma.ts";
import { Role } from "../../generated/prisma/enums.ts";
// the job of this function is to extract data from the db
export async function getAllTeacherApplications(){
    const requestsInDb = await prisma.teacherApplication.findMany({
        select:{
            id:true,
            name:true,
            email:true,
            status:true,
            createdAt:true,
            reviewedAt:true,
            rejectionReason:true,
        },
        orderBy:{
            createdAt:"desc"
        }

    })
    return requestsInDb;
}


export async function approveTeacherService({ appId, adminId }) {

    const result = await prisma.$transaction(async (tx) => {

        // 1. Find the teacher application
        const application = await tx.teacherApplication.findUnique({
            where: { id: appId },
            select: {
                id: true,
                status: true,
                name: true,
                email: true,
                passwordHash: true
            }
        });

        // 2. Check whether the application exists and is pending
        if (!application) {
            const error = new Error("Teacher application not found.");
            error.statusCode = 404;
            throw error;
        }

        if (application.status !== "pending") {
            const error = new Error("This application has already been reviewed.");
            error.statusCode = 400;
            throw error;
        }

        // 3. Create the teacher in the User table
        const createTeacher = await tx.user.create({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },
            data: {
                name: application.name,
                email: application.email,
                passwordHash: application.passwordHash,
                role: "teacher"
            }
            
        });

        // 4. Update the teacher application
        const updatedApplication = await tx.teacherApplication.update({
            where: {
                id: appId
            },
            data: {
                status: "approved",
                reviewedAt: new Date(),
                reviewedById: adminId
            }
        });

        // 5. Return both results
        return {
            teacher: createTeacher,
            application: updatedApplication
        };

    });

    return result;
}

export async function rejectTeacherService({appId,adminId,reason}){
    const application = await prisma.teacherApplication.findUnique({
        where:{
            id:appId
        },
        select:{
            id: true,
            status:true
        }  
    })  
        if (!reason || !reason.trim()) {
        const error = new Error("Rejection reason is required.");
        error.statusCode = 400;
        throw error;
        }

        if (!application) {
            const error = new Error("Teacher application not found.");
            error.statusCode = 404;
            throw error;
        }

        if (application.status !== "pending") {
            const error = new Error("This application has already been reviewed.");
            error.statusCode = 400;
            throw error;
        }
        const updatedApplication = await prisma.teacherApplication.update({
            where: {
                id: appId,
                
            },
            data: {
                status: "rejected",
                reviewedAt: new Date(),
                reviewedById: adminId,
                rejectionReason:reason.trim()
            },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                reviewedAt: true,
                reviewedById: true,
                rejectionReason: true
            }
            
        });
        return updatedApplication;
}