import IdeaModel from "./idea.model.js";

export async function createIdea(title,description,submittedBy){
    const newIdea = await IdeaModel.create({
        title:title,
        description:description,
        submittedBy: submittedBy,
    });
    return {
        _id : newIdea._id,
        title : newIdea.title,
        description : newIdea.description,
        submittedBy : newIdea.submittedBy,
        status : newIdea.status,
    }
    
}