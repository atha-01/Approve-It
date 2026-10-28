import express from 'express';
import {ideaController,searchIdeas, teacherReview} from './idea.controller.js';
import { auth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';

const router = express.Router();
router.post("/", auth, ideaController);
router.get("/", auth, searchIdeas);
router.get("/review",auth, requireRole("teacher"),teacherReview);
export default router;