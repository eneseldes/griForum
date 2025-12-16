import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Yetkisiz erişim" });

    const token = authHeader.split(" ")[1];

    //Token Çözümleme
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Kullanıcıyı DB'den Çekme
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Kullanıcı bulunamadı" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token geçersiz" });
  }
};
