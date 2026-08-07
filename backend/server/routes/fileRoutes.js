import express from 'express';
import {protect} from '../middleware/protect.js';
import upload from '../middleware/upload.js';

const router = express.Router();
router.post("/upload",protect,upload.single("file"),(req, res) => {
  console.log(req.file);

  res.status(200).json({
    message: "File received successfully",
    file: req.file
  });
})
export default router;