import express from 'express';
import {ideaController,searchIdeas} from './idea.controller.js';
import { auth } from '../../middleware/auth.js';

const router = express.Router();
router.post("/", auth, ideaController);
router.get("/", auth, searchIdeas);
export default router;