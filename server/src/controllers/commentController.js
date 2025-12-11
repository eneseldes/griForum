import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

// Controller kodları buraya
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id || req.userId;

    if (!userId)
      return res.status(401).json({ message: "Yetkilendirme gerekli." });

    if (!text || !text.trim())
      return res.status(400).json({ message: "Geçersiz yorum metni." });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Gönderi bulunamadı." });

    const comment = new Comment({
      text: text.trim(),
      author: userId,
      post: postId,
    });

    await comment.save();

    if (Array.isArray(post.comments)) {
      post.comments.push(comment._id);
      await post.save();
    }

    const populated = await comment.populate("author", "username email");
    return res.status(201).json(populated);
  } catch (err) {
    console.error("Comment oluşturma hatası:", err);
    return res.status(500).json({
      message: "Yorum oluşturulurken hata oluştu.",
      error: err.message,
    });
  }

  console.log("Comment created successfully");
};
