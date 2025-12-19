import express from "express";
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  likeComment,
} from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route'lar buraya...
router.post("/:postId", authMiddleware, createComment);

router.get("/:postId", getPostComments);

router.put("/:commentId", authMiddleware, updateComment);

router.delete("/:commentId", authMiddleware, deleteComment);

router.post("/:commentId/like", authMiddleware, likeComment);

export default router;
