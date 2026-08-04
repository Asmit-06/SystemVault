import { createFolder } from "../controllers/folderController.js";
import express from "express";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/", protect, createFolder);

export default router;