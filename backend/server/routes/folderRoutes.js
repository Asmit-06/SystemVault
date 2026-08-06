import { createFolder,getFolders,getFolderById,updateFolder,deleteFolder} from "../controllers/folderController.js";
import express from "express";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/", protect, createFolder);
router.get("/", protect, getFolders);
router.get("/:id", protect, getFolderById);
router.patch("/:id", protect, updateFolder);
router.delete("/:id", protect, deleteFolder);
export default router;