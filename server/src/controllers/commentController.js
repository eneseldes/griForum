import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

// Controller kodları buraya
// adding comment
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id || req.userId;

    if (!userId)
      return res.status(401).json({ message: "Yetkilendirme gerekli." });

    if (!mongoose.isValidObjectId(postId))
      return res.status(400).json({ message: "Geçersiz postId." });

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
};

// Get comments for a post
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username email profilePicture") // Populate author details
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res
      .status(500)
      .json({ message: "Error fetching comments", error: err.message });
  }
};

// Update
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id || req.userId;

    if (!userId)
      return res.status(401).json({ message: "Yetkilendirme gerekli." });

    if (!mongoose.isValidObjectId(commentId))
      return res.status(400).json({ message: "Geçersiz commentId." });

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own comments" });
    }

    if (!text || !text.trim())
      return res.status(400).json({ message: "Geçersiz yorum metni." });

    comment.text = text.trim();
    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    console.error("Error updating comment:", err);
    return res
      .status(500)
      .json({ message: "Error updating comment", error: err.message });
  }
};

// Delete
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id || req.userId;

    if (!userId)
      return res.status(401).json({ message: "Yetkilendirme gerekli." });

    if (!mongoose.isValidObjectId(commentId))
      return res.status(400).json({ message: "Geçersiz commentId." });

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    await comment.deleteOne();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res
      .status(500)
      .json({ message: "Error deleting comment", error: err.message });
  }
};

// Like Unlike
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id || req.userId;

    if (!userId)
      return res.status(401).json({ message: "Yetkilendirme gerekli." });

    if (!mongoose.isValidObjectId(commentId))
      return res.status(400).json({ message: "Geçersiz commentId." });

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const likedIndex = comment.likes.findIndex(
      (id) => id.toString() === userId
    );

    if (likedIndex >= 0) {
      comment.likes.splice(likedIndex, 1);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    console.error("Error liking comment:", err);
    return res
      .status(500)
      .json({ message: "Error liking comment", error: err.message });
  }
};
