import express from 'express';
import {getAllIdeasController, ideaController,reviewIdeaController,searchIdeas, teacherReview} from './idea.controller.js';
import { auth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';

const router = express.Router();
router.post("/", auth,requireRole("teacher"), ideaController);
router.get("/", auth, searchIdeas);
router.get("/database",auth , getAllIdeasController)
router.get("/review",auth, requireRole("teacher"),teacherReview);
router.patch("/:id/review",auth,requireRole("teacher"),reviewIdeaController)

export default router;