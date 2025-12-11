import express from "express";
import { createComment } from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route'lar buraya...
router.post("/:postId/comments", authMiddleware, createComment);

export default router;
