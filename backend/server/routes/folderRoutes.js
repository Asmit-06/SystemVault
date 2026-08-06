import { createFolder,getFolders,getFolderById } from "../controllers/folderController.js";
import express from "express";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/", protect, createFolder);
router.get("/", protect, getFolders);
router.get("/:id", protect, getFolderById);
export default router;