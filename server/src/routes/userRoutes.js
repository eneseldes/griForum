import express from "express";
import {
    getSavedPosts,
    updateProfile,
    getUserStatsAndPosts,
    getMe
} from "../controllers/userController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.get("/stats", authMiddleware, getUserStatsAndPosts);
router.get("/saved", authMiddleware, getSavedPosts);
router.put("/update", authMiddleware, updateProfile);

export default router;
