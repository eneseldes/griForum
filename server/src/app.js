import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { createTestUser } from "./config/createTestUser.js";

import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Reading .env
dotenv.config();

// Create express instance
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Connect DB
await connectDB();

// Otomatik test user oluştur ve token üret
await createTestUser();

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