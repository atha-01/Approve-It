import prisma from "../../config/prisma.ts";

export async function createIdea(title,description,submittedBy){
    const newIdea = await prisma.idea.create({
        data:{
            title:title,
            description:description,
            submittedById: submittedBy,
        }
        
    });
    return {
        id : newIdea.id,
        title : newIdea.title,
        description : newIdea.description,
        submittedBy : newIdea.submittedById,
        status : newIdea.status,
    }
    
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
        }

    })
    return searchResult;
}