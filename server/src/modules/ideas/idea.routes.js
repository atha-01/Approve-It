import express from 'express';
import {ideaController} from './idea.controller.js';
import { auth } from '../../middleware/auth.js';

const router = express.Router();
router.post("/", auth, ideaController);
export default router;