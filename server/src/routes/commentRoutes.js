import express from "express";
import { createComment } from "../controllers/commentController.js";

const router = express.Router();

// Route'lar buraya...
router.post("/:postId/comments", createComment);

export default router;
