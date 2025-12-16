import express from "express";

import { getAllUsers, updateUserRole } from "../controllers/adminController.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.post("/users/:userId/role", authMiddleware, adminMiddleware, updateUserRole);

export default router;
