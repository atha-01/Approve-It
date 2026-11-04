import fs from 'node:fs/promises'
import path from "node:path";
import {
    createIdea,
    getIdeasByUser,
    getAllIdeasForReview,
    teacherApprovalUpdate,
    getAllIdeasForDatabase,
    findIdeaByStudents,
    getIdeaPdfDetails
} from "./idea.service.js";

import { processIdeaPdfUpload } from "./idea.upload.js";
import { uploadDirectory } from "./idea.upload.js";



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
        const {
            title,
            description,
            category,
            problemStatement,
            proposedSolution,
            academicYear
        } = req.body;

        // Validate the required fields.
        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            typeof academicYear !== "string" ||
            !academicYear.trim()||
            typeof category !== "string" ||
            !category.trim() ||
            typeof problemStatement !== "string" ||
            !problemStatement.trim() ||
            typeof proposedSolution !== "string" ||
            !proposedSolution.trim()
        ) {
            await fs.unlink(uploadedFilePath);
            uploadedFilePath = undefined;

            return res.status(400).json({
               message: "Title, description, category, problem statement, proposed solution, and academic year are required.",
            });
        }

        // Save the idea and PDF metadata in PostgreSQL.
        const createdIdea = await createIdea({
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            problemStatement: problemStatement.trim(),
            proposedSolution: proposedSolution.trim(),
            submittedById: req.user.userId,
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
            message:"Something went wrong..."
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
export async function reviewIdeaController(req, res) {
    const allowedStatuses = ["under_review", "approved", "rejected"];

    try {
        const ideaId = req.params.id;
        const teacherId = req.user.userId;
        const status = req.body?.status;
        const feedback = req.body?.feedback;

        if (!status) {
            return res.status(400).json({
                message: "Please set a status for the Idea."
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Choose an appropriate Status"
            });
        }

        if (feedback !== undefined && typeof feedback !== "string") {
            return res.status(400).json({
                message: "Feedback must be text."
            });
        }

        if (status === "rejected" && !feedback?.trim()) {
            return res.status(400).json({
                message: "Please provide feedback when rejecting an idea."
            });
        }

        const ideaResult = await teacherApprovalUpdate(
            ideaId,
            teacherId,
            status,
            feedback
        );

        return res.status(200).json(ideaResult);

    } catch (error) {
        console.error("Failed to review idea:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

export async function getAllIdeasController(req, res) {
    try {
        const allowedStatuses = [
            "pending",
            "under_review",
            "approved",
            "rejected"
        ];

        const academicYear = req.query.academicYear;
        let status = req.query.status;
        const query = req.query.query?.trim();

        // Treat "all" as no status filter
        if (status === "all" || !status) {
            status = undefined;
        }

        // Validate status if one is provided and that provided status must be only one of our 4. Nothing new
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        // Get matching ideas from the service
        const receivedIdeaDetails = await getAllIdeasForDatabase({
            academicYear,
            status,
            query
        });

        return res.status(200).json(receivedIdeaDetails);
    }
    catch (error) {
        console.error("Error fetching ideas:", error);

        return res.status(500).json({
            message: "Something went wrong..."
        });
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
export async function pdfDetailsController(req, res) {
    try {
        const ideaId = req.params.id;
        const recievedData = await getIdeaPdfDetails(ideaId);

        if (!recievedData) {
            return res.status(404).json({
                message: "Idea not found."
            });
        }

        // Check user authorization.
        const userId = req.user.userId;
        const userRole = req.user.role;

        if (
            userRole !== "teacher" &&
            !(userRole === "student" &&
              recievedData.submittedById === userId)
        ) {
            return res.status(403).json({
                message: "You are not authorized to access this PDF."
            });
        }

        // Resolve and validate the stored file path.
        const filePath = path.resolve(recievedData.pdfPath);
        const relativePath = path.relative(uploadDirectory, filePath);

        if (
            relativePath.startsWith("..") ||
            path.isAbsolute(relativePath)
        ) {
            return res.status(403).json({
                message: "Invalid PDF location."
            });
        }

        // Check whether the PDF actually exists.
        await fs.access(filePath);

        const safeFileName = path.basename(recievedData.pdfFileName)
            .replace(/["\\]/g, "_");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${safeFileName}"`
        );
        res.setHeader("Cache-Control", "private, no-store");

        return res.sendFile(filePath, (error) => {
            if (error) {
                console.error("PDF sending failed:", error);

                if (!res.headersSent) {
                    res.status(500).json({
                        message: "Unable to send PDF."
                    });
                }
            }
        });

    } catch (error) {
        if (error.code === "ENOENT") {
            return res.status(404).json({
                message: "PDF file not found on server."
            });
        }

        console.error("PDF retrieval failed:", error);

        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
}