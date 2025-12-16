// Controller kodları buraya
import User from "../models/User.js"

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
  };

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Rol belirtilmelidir" });
    }

    const validRoles = ["user", "admin"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Geçersiz rol" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json({ message: "Rol güncellendi", user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
};
  
