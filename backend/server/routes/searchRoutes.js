import express from "express";
import { protect } from "../middleware/protect.js";
import { search } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", protect, search);

export default router;