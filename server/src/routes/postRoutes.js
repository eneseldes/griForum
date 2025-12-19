import express from "express";
import {
  getDetailPost,
  getHomePosts,
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  savePost,
  getMyPosts,
  getMyLikedPosts,
} from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route'lar buraya...
router.get("/home", getHomePosts);
router.get("/detail", getDetailPost);
router.get("/", getAllPosts);
router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/my-liked-posts", authMiddleware, getMyLikedPosts);
router.get("/:postId", getPostById);
router.post("/", authMiddleware, createPost);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, deletePost);
router.post("/:postId/like", authMiddleware, likePost);
router.post("/:postId/save", authMiddleware, savePost);

export default router;
