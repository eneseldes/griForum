/**
 * Helper Functions
 * 
 * Genel yardımcı fonksiyonlar. Interaction utilities ve diğer ortak fonksiyonlar.
 */

import { getUserIdFromToken } from "../api/client";

/**
 * Checks if user has liked an item (post or comment)
 */
export const hasUserLiked = (likes) => {
  const userId = getUserIdFromToken();
  if (!userId || !Array.isArray(likes)) return false;
  return likes.some((likeId) => likeId.toString() === userId);
};

/**
 * Checks if user is the owner of an item
 */
export const isUserOwner = (authorId) => {
  const userId = getUserIdFromToken();
  if (!userId || !authorId) return false;
  return authorId.toString() === userId.toString();
};

/**
 * Gets like count from likes array or likesCount property
 */
export const getLikeCount = (likes, likesCount) => {
  if (typeof likesCount === "number") return likesCount;
  return Array.isArray(likes) ? likes.length : 0;
};

/**
 * Validates post form data
 */
export const validatePost = (title, category, editorRef, showError) => {
  if (!title.trim()) {
    showError("Please enter a title");
    return false;
  }

  if (!category) {
    showError("Please select a category");
    return false;
  }

  if (!editorRef.current) {
    showError("Editor is not ready");
    return false;
  }

  return true;
};

/**
 * Extracts content from Editor.js
 */
export const extractEditorContent = async (editorRef, showError) => {
  const outputData = await editorRef.current.save();
  
  if (!outputData || !outputData.blocks || outputData.blocks.length === 0) {
    showError("Please enter some content");
    return null;
  }

  return JSON.stringify(outputData);
};

