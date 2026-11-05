import express from 'express';
import { searchQueryController } from "./search.controller.js";

const router = express.Router();

router.get("/",searchQueryController)

export default router;