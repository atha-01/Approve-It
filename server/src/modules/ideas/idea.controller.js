import {
    createIdea,
    getIdeasByUser,
    getAllIdeasForReview,
    teacherApprovalUpdate,
    getAllIdeasForDatabase,
    findIdeaByStudents,
} from "./idea.service.js";

import { processIdeaPdfUpload } from "./idea.upload.js";
import fs from 'node:fs/promises'


export async function ideaController(req, res) {
    let uploadedFilePath;

    try {
        // Wait for Multer to finish processing the uploaded PDF.
        await processIdeaPdfUpload(req, res);

        // Make sure a PDF was uploaded.
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a synopsis PDF.",
            });
        }

        uploadedFilePath = req.file.path;

        // Read the fields sent with the multipart form.
        const { title, description, submittedById, academicYear } =
            req.body;

        // Validate the required fields.
        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            typeof submittedById !== "string" ||
            !submittedById.trim() ||
            typeof academicYear !== "string" ||
            !academicYear.trim()
        ) {
            await fs.unlink(uploadedFilePath);
            uploadedFilePath = undefined;

            return res.status(400).json({
                message:
                    "Title, description, student submitter, and academic year are required.",
            });
        }

        // Save the idea and PDF metadata in PostgreSQL.
        const createdIdea = await createIdea({
            title: title.trim(),
            description: description.trim(),
            submittedById: submittedById.trim(),
            uploadedById: req.user.userId,
            academicYear: academicYear.trim(),
            pdfPath: uploadedFilePath,
            pdfFileName: req.file.originalname,
        });

        return res.status(201).json(createdIdea);
    } catch (error) {
        // Remove the uploaded file if database creation or validation fails.
        if (uploadedFilePath) {
            await fs.unlink(uploadedFilePath).catch(() => {});
        }

        // Handle Multer upload errors.
        if (
            error.code === "LIMIT_FILE_SIZE" ||
            error.code === "LIMIT_FILE_COUNT" ||
            error.code === "LIMIT_UNEXPECTED_FILE"
        ) {
            return res.status(400).json({
                message: error.message,
            });
        }

        // Handle unsupported file types.
        if (error.message === "Only PDF files are allowed.") {
            return res.status(400).json({
                message: error.message,
            });
        }

        // Handle service-level validation errors.
        if (error.statusCode === 400) {
            return res.status(400).json({
                message: error.message,
            });
        }

        console.error("Failed to create idea:", error);

        return res.status(500).json({
            message: "Failed to upload idea. Please try again later.",
        });
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

export async function getAllIdeasController(req,res){
    try{
        const year = req.query.academicYear;
        if(!year){
            return res.status(400).json({
                message:"No records for this year"
            })
        }
        const recievedIdeaDetails = await getAllIdeasForDatabase(year);
        

        res.status(200).json(recievedIdeaDetails);
    }
    catch(error){
        res.status(500).json({
            message:"Something went wrong..."
        })
    }
}

export async function findIdeasByStdsController(req,res){
    try{

    const result = req.params.id;
    if(!result){
        return res.status(400).json({
            message:"Couldn't find any idea to query"
        })
    }
    const recievedRes = await findIdeaByStudents(result);
    if(!recievedRes){
        return res.status(404).json({
            message:"Please enter an Idea",
        })
    }
    else{  
        return res.status(200).json(recievedRes)
    }
    
    }
    catch(error){
        return res.status(500).json({
            message:"Internal Server Error."
        })
    } 
}