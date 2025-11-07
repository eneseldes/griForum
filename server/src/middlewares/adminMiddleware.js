export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next(); // Adminse devam et
    } else {
      res.status(403).json({ message: "Erişim reddedildi. Admin yetkisi gerekli." });
    }
  };
  