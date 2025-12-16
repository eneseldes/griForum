import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ======================================================
// JWT OLUŞTURMA
// ======================================================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ======================================================
// REGISTER
// ======================================================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı" });
    }

    // Şifre kaydetme
    const user = await User.create({
      username,
      email,
      password,
      role: "user",
    });

    res.status(201).json({
      message: "Kayıt başarılı",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({
      message: "Kayıt sırasında hata oluştu",
      error: err.message,
    });
  }
};

// ======================================================
// LOGIN
// ======================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email veya şifre hatalı" });

    // Ham şifre karşılaştırması
    if (password !== user.password) {
      return res.status(400).json({ message: "Email veya şifre hatalı" });
    }

    res.status(200).json({
      message: "Giriş başarılı",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({
      message: "Giriş sırasında hata oluştu",
      error: err.message,
    });
  }
};

// ======================================================
// KULLANICI BİLGİLERİ
// ======================================================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Kullanıcı bilgileri alınamadı",
      error: err.message,
    });
  }
};
