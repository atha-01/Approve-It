import { createIdea, getIdeasByUser , getAllIdeasForReview , teacherApprovalUpdate} from "./idea.service.js";

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

export async function teacherReview (req,res){
    try {
        const ideas = await getAllIdeasForReview()
        return res.status(200).json(ideas)
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong",
        })
    }
}
export async function reviewIdeaController(req,res){
    const allowedStatuses = ["under_review","approved","rejected"];
    try {
        const ideaId = req.params.id;
        const teacherId = req.user.userId;
        const status = req.body?.status;
        if(!status){
            return res.status(400).json({
                message:"Please set a status for the Idea."
            })
        }
        else if(allowedStatuses.includes(status)){
        const ideaResult = await teacherApprovalUpdate(ideaId,teacherId,status)
        return res.status(200).json(ideaResult)
        }
        else{
            return res.status(400).json({
                message:"Choose an appropriate Status"
            })
        }
        
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }

}