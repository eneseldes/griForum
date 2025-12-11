import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const createTestUser = async () => {
  try {
    // Test user'ı kontrol et
    let testUser = await User.findOne({ email: "test@test.com" });
    
    if (!testUser) {
      // Test user yoksa oluştur
      testUser = new User({
        username: "testuser",
        email: "test@test.com",
        password: "test123", // Şifre hash'lenmemiş, sadece test için
        role: "user"
      });
      await testUser.save();
      console.log("✅ Test user oluşturuldu:", testUser.username);
    } else {
      console.log("✅ Test user zaten mevcut:", testUser.username);
    }

    // JWT token oluştur
    if (!process.env.JWT_SECRET) {
      console.warn("⚠️  JWT_SECRET environment variable tanımlı değil! Token oluşturulamıyor.");
      return;
    }

    const token = jwt.sign(
      { 
        id: testUser._id.toString(),
        username: testUser.username,
        email: testUser.email,
        role: testUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log("\n" + "=".repeat(60));
    console.log("🔑 TEST USER JWT TOKEN:");
    console.log("=".repeat(60));
    console.log(token);
    console.log("=".repeat(60));
    console.log("📋 Kullanıcı Bilgileri:");
    console.log("   Username:", testUser.username);
    console.log("   Email:", testUser.email);
    console.log("   ID:", testUser._id);
    console.log("=".repeat(60) + "\n");

  } catch (error) {
    console.error("❌ Test user oluşturulurken hata:", error.message);
  }
};

