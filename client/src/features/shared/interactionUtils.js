/**
 * Interaction Utilities
 * 
 * Post ve comment'ler için kullanıcı etkileşim yardımcı fonksiyonları.
 * Beğeni kontrolü, sahiplik kontrolü ve beğeni sayısı hesaplama fonksiyonları içerir.
 */

import { getUserIdFromToken } from "./api";

/**
 * Checks if user has liked an item (post or comment)
 * @param {Array} likes - Array of user IDs who liked
 * @returns {boolean} - True if current user has liked
 */
export const hasUserLiked = (likes) => {
  const userId = getUserIdFromToken();
  if (!userId || !Array.isArray(likes)) return false;
  return likes.some((likeId) => likeId.toString() === userId);
};

/**
 * Checks if user is the owner of an item
 * @param {string|Object} authorId - Author ID of the item
 * @returns {boolean} - True if current user is the owner
 */
export const isUserOwner = (authorId) => {
  const userId = getUserIdFromToken();
  if (!userId || !authorId) return false;
  return authorId.toString() === userId.toString();
};

/**
 * Gets like count from likes array or likesCount property
 * @param {Array} likes - Array of user IDs who liked
 * @param {number} likesCount - Optional likes count
 * @returns {number} - Like count
 */
export const getLikeCount = (likes, likesCount) => {
  if (typeof likesCount === "number") return likesCount;
  return Array.isArray(likes) ? likes.length : 0;
};

