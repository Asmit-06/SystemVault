import express from 'express';
import {protect} from '../middleware/protect.js';
import upload from '../middleware/upload.js';
import { uploadFile } from '../controllers/fileController.js'

const router = express.Router();
router.post("/upload",protect,upload.single("file"),uploadFile);

export default router;