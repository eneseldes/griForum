import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Reading .env
dotenv.config();

// Create express instance
const app = express();
app.use(express.json());

// Connect DB
await connectDB();

// Route mounts
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

// Start server
app.listen(3000, () => {
  console.log(`Sunucu http://localhost:${3000} adresinde çalışıyor...`);
});