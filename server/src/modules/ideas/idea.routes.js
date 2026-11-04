import express from 'express';
import {
    findIdeasByStdsController,
    getAllIdeasController,
    ideaController,
    reviewIdeaController,
    searchIdeas,
    teacherReview,
    pdfDetailsController
} from './idea.controller.js';
import { auth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';

const router = express.Router();
router.post("/", auth, requireRole("student"), ideaController);
router.get("/", auth, searchIdeas);
router.get("/database", auth, getAllIdeasController);
router.get("/review", auth, requireRole("teacher"), teacherReview);
router.get("/:id/pdf", auth, pdfDetailsController);
router.get("/:id", auth, findIdeasByStdsController);
router.patch("/:id/review", auth, requireRole("teacher"), reviewIdeaController)


export default router;