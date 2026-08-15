import express from "express";
import { protect } from "../middleware/protect.js";
import upload from "../middleware/upload.js";

import {
  uploadFile,
  getFileById,
  getFiles,
  updateFile,
  deleteFile,
  downloadFile,
  getTrash,
  restoreFile,
  permanentDeleteFile
} from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadFile);

router.get("/", protect, getFiles);

router.get("/trash", protect, getTrash);

router.get("/download/:id", protect, downloadFile);

router.patch("/restore/:id", protect, restoreFile);

router.delete("/permanent/:id", protect, permanentDeleteFile);

router.get("/:id", protect, getFileById);

router.patch("/:id", protect, updateFile);

router.delete("/:id", protect, deleteFile);

export default router;