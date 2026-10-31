import express from 'express';
import { auth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { getTeacherReqsController } from './admin.controller.js';
const router = express.Router();
router.get("/teacher-applications", auth,requireRole("admin"), getTeacherReqsController);

export default router;