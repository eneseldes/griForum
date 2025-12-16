import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// /register => Kayıt olma
router.post("/register", register);

// /login => Giriş yapma
router.post("/login", login);

// /me => Token ile giriş yapan kullanıcının bilgilerini gönder
router.get("/me", authMiddleware, getMe);

export default router;
