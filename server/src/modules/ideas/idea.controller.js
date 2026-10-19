import { createIdea, getIdeasByUser} from "./idea.service.js";

export async function ideaController(req,res){
    try{
    const title = req.body.title;
    const description = req.body.description;
    const submittedBy = req.user.userId

    const createdIdea = await createIdea(title,description,submittedBy)
    return res.status(201).json(createdIdea)
    }
    catch(error){
            return res.status(500).json({
                message:"Failed to create idea. Please try again later."
            })
    }
    
}
export async function searchIdeas(req,res){
    try{
        const userIdOfIdeaSender = req.user.userId;
        const recievedIdeas = await getIdeasByUser(userIdOfIdeaSender);
        return res.status(200).json(recievedIdeas);
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
}