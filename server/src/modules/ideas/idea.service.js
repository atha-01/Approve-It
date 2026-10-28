import prisma from "../../config/prisma.ts";


export async function createIdea({
    title,
    description,
    submittedById,
    uploadedById,
    academicYear,
    pdfPath,
    pdfFileName,
}) {
    // Confirm that the selected submitter is a student.
    const student = await prisma.user.findUnique({
        where: { id: submittedById },
        select: { id: true, role: true },
    });

    if (!student || student.role !== "student") {
        const error = new Error("A valid student submitter is required.");
        error.statusCode = 400;
        throw error;
    }

    const newIdea = await prisma.idea.create({
        data: {
            title,
            description,
            submittedById,
            uploadedById,
            academicYear,
            pdfPath,
            pdfFileName,
        },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            academicYear: true,
            pdfFileName: true,
            submittedById: true,
            uploadedById: true,
            createdAt: true,
        },
    });

    return newIdea;
}


export async function getIdeasByUser(userId){
    const fetchIdeas = await prisma.idea.findMany({
        where:{
            submittedById:userId,
        },
        
    });
    return fetchIdeas;
}


export async function getAllIdeasForReview() {
    const toBeReviewed = await prisma.idea.findMany({
        include: {
            submittedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return toBeReviewed ;
}


export async function teacherApprovalUpdate(ideaId,teacherId,status){
    const searchResult = await prisma.idea.update({
        where:{
            id : ideaId
        },
        data:{
            status: status,
            reviewedById : teacherId,
            reviewedAt : new Date()
        },
        select:{
            id:true,
            title:true, 
            description:true,
            status:true, 
            academicYear:true,
            submittedById:true, 
            uploadedById:true, 
            reviewedById:true,
            reviewedAt:true, 
            createdAt:true, 
            updatedAt:true
        }

    })
    return searchResult;
}

    export async function getAllIdeasForDatabase(academicYear){
        const searchResult = await prisma.idea.findMany({
            where:{
                academicYear : academicYear
            },

            select:{
                title: true,
                status:true,
                academicYear:true,
                createdAt:true,

                submittedBy:{
                    select: {
                    name:true,
                },
                }
            },
            orderBy: {
                createdAt: "desc",
            },

        })
        return searchResult;
    }