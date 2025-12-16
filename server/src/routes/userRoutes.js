import express from "express";
import {
    getLikedPosts,
    getSavedPosts,
    getMyPosts,
    updateProfile,
    getUserStatsAndPosts
} from "../controllers/userController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getUserStatsAndPosts);
router.get("/liked", authMiddleware, getLikedPosts);
router.get("/saved", authMiddleware, getSavedPosts);
router.get("/myposts", authMiddleware, getMyPosts);
router.put("/update", authMiddleware, updateProfile);

export default router;
