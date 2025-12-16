// Controller kodları buraya
import User from "../models/User.js"
import Post from "../models/Post.js"


export const getUserStatsAndPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("likedPosts").populate("savedPosts");
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    res.json({likedPosts: user.likedPosts, likedCount: user.likedPosts.length, savedPosts: user.savedPosts, savedCount: user.savedPosts.length});

  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
}

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("likedPosts");
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    res.json(user.likedPosts);

  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("savedPosts");
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    res.json(user.savedPosts);

  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ author: userId });
    
    res.json(posts); 

  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, password } = req.body;

    const updatedData = {};
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    if (password) {
      updatedData.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json({ message: "Profil güncellendi", user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
};
