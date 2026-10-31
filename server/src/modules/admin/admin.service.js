
import prisma from "../../config/prisma.ts";
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