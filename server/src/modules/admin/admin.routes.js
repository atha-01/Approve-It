import express from 'express';
import { auth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { getTeacherReqsController,approveTeacherController,rejectTeacherController } from './admin.controller.js';

const router = express.Router();


router.get("/teacher-applications", auth, requireRole("admin"), getTeacherReqsController);
router.patch("/teacher-applications/:id/approve", auth, requireRole("admin"),approveTeacherController );
router.patch("/teacher-applications/:id/reject", auth, requireRole("admin"),rejectTeacherController);
export default router;