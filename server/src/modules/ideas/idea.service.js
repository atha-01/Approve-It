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