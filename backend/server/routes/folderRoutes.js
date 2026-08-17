import { createFolder,getFolders,getFolderById,updateFolder,deleteFolder,getTrashFolders,restoreFolder,permanentlyDeleteFolder} from "../controllers/folderController.js";
import express from "express";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/", protect, createFolder);
router.get("/", protect, getFolders);
router.get("/trash", protect, getTrashFolders);
router.patch("/restore/:id", protect, restoreFolder);
router.delete("/permanent/:id", protect, permanentlyDeleteFolder);
router.get("/:id", protect, getFolderById);
router.patch("/:id", protect, updateFolder);
router.delete("/:id", protect, deleteFolder);
export default router;