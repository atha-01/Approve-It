import prisma from "../../config/prisma.ts";


export async function createIdea({
    title,
    description,
    submittedById,
    uploadedById,
    academicYear,
    pdfPath,
    pdfFileName,
    category,
    problemStatement,
    proposedSolution
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
            category,
            problemStatement,
            proposedSolution,
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
            category:true,
            problemStatement:true,
            proposedSolution:true,
        },
    });

    return newIdea;
}


export async function getIdeasByUser(userId) {
    const fetchIdeas = await prisma.idea.findMany({
        where: {
            submittedById: userId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            problemStatement: true,
            proposedSolution: true,
            status: true,
            feedback: true,
            academicYear: true,
            pdfFileName: true,
            submittedById: true,
            uploadedById: true,
            reviewedById: true,
            reviewedAt: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return fetchIdeas;
}


export async function getAllIdeasForReview() {
    const toBeReviewed = await prisma.idea.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            problemStatement: true,
            proposedSolution: true,
            status: true,
            feedback: true,
            academicYear: true,
            pdfFileName: true,
            submittedById: true,
            uploadedById: true,
            reviewedById: true,
            reviewedAt: true,
            createdAt: true,
            updatedAt: true,

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

    return toBeReviewed;
}


export async function teacherApprovalUpdate(ideaId, teacherId, status, feedback) {
    const searchResult = await prisma.idea.update({
        where: {
            id: ideaId
        },
        data: {
            status: status,
            feedback: feedback?.trim() || null,
            reviewedById: teacherId,
            reviewedAt: new Date()
        },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            feedback: true,
            academicYear: true,
            submittedById: true,
            uploadedById: true,
            reviewedById: true,
            reviewedAt: true,
            createdAt: true,
            updatedAt: true
        }

    })
    return searchResult;
}

export async function getAllIdeasForDatabase(academicYear) {
    const searchResult = await prisma.idea.findMany({
        where: {
            academicYear: academicYear
        },

        select: {
            title: true,
            status: true,
            academicYear: true,
            createdAt: true,

            submittedBy: {
                select: {
                    name: true,
                },
            }
        },
        orderBy: {
            createdAt: "desc",
        },

    })
    return searchResult;
}

export async function findIdeaByStudents(ideaId) {
    const searchResult = await prisma.idea.findUnique({
        where: {
            id: ideaId
        },
        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            problemStatement: true,
            proposedSolution: true,
            status: true,
            academicYear: true,

            submittedBy: {
                select: {
                    name: true,
                    email: true,
                },
            },

            uploadedById: true,
            reviewedById: true,
            reviewedAt: true,
            createdAt: true,
            updatedAt: true,
        }
    })
    return searchResult;
}