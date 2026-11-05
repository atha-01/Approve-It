// new imports used when deployment was needed.
import {
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand
} from "@aws-sdk/client-s3";
import path from "node:path";
import s3 from "../../config/s3.js";
import { generatePdfKey, processIdeaPdfUpload } from "./idea.upload.js";
import {
    createIdea,
    getIdeasByUser,
    getAllIdeasForReview,
    teacherApprovalUpdate,
    getAllIdeasForDatabase,
    findIdeaByStudents,
    getIdeaPdfDetails
} from "./idea.service.js";


//  Removed these because No longer using disk Storage
// import fs from 'node:fs/promises'
// import path from "node:path";
// import { uploadDirectory } from "./idea.upload.js";
// import { processIdeaPdfUpload } from "./idea.upload.js";





export async function ideaController(req, res) {
    let uploadedObjectKey;

    try {
        // Process the uploaded PDF.
        await processIdeaPdfUpload(req, res);

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a synopsis PDF.",
            });
        }

        // Read the submitted idea details.
        const {
            title,
            description,
            category,
            problemStatement,
            proposedSolution,
            academicYear
        } = req.body;

        // Validate required fields.
        if (
            typeof title !== "string" || !title.trim() ||
            typeof description !== "string" || !description.trim() ||
            typeof academicYear !== "string" || !academicYear.trim() ||
            typeof category !== "string" || !category.trim() ||
            typeof problemStatement !== "string" || !problemStatement.trim() ||
            typeof proposedSolution !== "string" || !proposedSolution.trim()
        ) {
            return res.status(400).json({
                message: "Title, description, category, problem statement, proposed solution, and academic year are required.",
            });
        }

        // Generate a unique S3 object key.
        uploadedObjectKey = generatePdfKey();

        // Upload the PDF to AWS S3.
        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: uploadedObjectKey,
                Body: req.file.buffer,
                ContentType: "application/pdf",
            })
        );

        // Save idea details and S3 object key in PostgreSQL.
        const createdIdea = await createIdea({
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            problemStatement: problemStatement.trim(),
            proposedSolution: proposedSolution.trim(),
            submittedById: req.user.userId,
            uploadedById: req.user.userId,
            academicYear: academicYear.trim(),
            pdfPath: uploadedObjectKey,
            pdfFileName: req.file.originalname,
        });

        return res.status(201).json(createdIdea);

    } catch (error) {
        // Delete the S3 object if the database operation fails.
        if (uploadedObjectKey) {
            try {
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: uploadedObjectKey,
                    })
                );
            } catch (cleanupError) {
                console.error("Failed to clean up S3 PDF:", cleanupError);
            }
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

export async function searchIdeas(req, res) {
    try {
        const userIdOfIdeaSender = req.user.userId;
        const recievedIdeas = await getIdeasByUser(userIdOfIdeaSender);
        return res.status(200).json(recievedIdeas);
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong..."
        })
    }
}

export async function teacherReview(req, res) {
    try {
        const ideas = await getAllIdeasForReview()
        return res.status(200).json(ideas)
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
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
        const academicYear = req.query.academicYear;
        const query = req.query.query?.trim();

        const receivedIdeaDetails = await getAllIdeasForDatabase({
            academicYear,
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

export async function findIdeasByStdsController(req, res) {
    try {

        const result = req.params.id;
        if (!result) {
            return res.status(400).json({
                message: "Couldn't find any idea to query"
            })
        }
        const recievedRes = await findIdeaByStudents(result);
        if (!recievedRes) {
            return res.status(404).json({
                message: "Please enter an Idea",
            })
        }
        else {
            return res.status(200).json(recievedRes)
        }

    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
}


export async function pdfDetailsController(req, res) {
    try {
        const ideaId = req.params.id;
        const receivedData = await getIdeaPdfDetails(ideaId);

        if (!receivedData) {
            return res.status(404).json({
                message: "Idea not found."
            });
        }

        // Check user authorization.
        const userId = req.user.userId;
        const userRole = req.user.role;

        const isOwner = receivedData.submittedById === userId;
        const isPrivilegedUser =
            userRole === "teacher" || userRole === "admin";
        const isApproved = receivedData.status === "approved";

        if (!isOwner && !isPrivilegedUser && !isApproved) {
            return res.status(403).json({
                message: "You are not authorized to access this PDF."
            });
        }

        // Check whether PDF information exists.
        if (!receivedData.pdfPath || !receivedData.pdfFileName) {
            return res.status(404).json({
                message: "PDF not found for this idea."
            });
        }

        // Retrieve the PDF from AWS S3.
        const s3Response = await s3.send(
            new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: receivedData.pdfPath,
            })
        );

        if (!s3Response.Body) {
            return res.status(404).json({
                message: "PDF file not found in storage."
            });
        }

        // Prepare the PDF response.
        const safeFileName = path.basename(receivedData.pdfFileName)
            .replace(/["\\]/g, "_");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${safeFileName}"`
        );
        res.setHeader("Cache-Control", "private, no-store");

        // Stream the PDF directly to the frontend.
        return s3Response.Body.pipe(res);

    } catch (error) {
        if (
            error.name === "NoSuchKey" ||
            error.$metadata?.httpStatusCode === 404
        ) {
            return res.status(404).json({
                message: "PDF file not found in storage."
            });
        }

        console.error("PDF retrieval failed:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Unable to retrieve PDF. Please try again later."
            });
        }
    }
}

