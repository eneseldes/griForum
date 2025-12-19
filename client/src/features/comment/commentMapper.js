/**
 * Comment Mapper
 * 
 * Backend'den gelen raw comment verilerini frontend formatına dönüştüren mapper.
 * Avatar URL'lerini düzenler ve tarih formatlarını dönüştürür.
 */

import { DEFAULT_AVATAR } from "../../constants/config";

export const mapCommentFromApi = (rawComment) => {
  if (!rawComment) return null;

  const createdAt = rawComment.createdAt ? new Date(rawComment.createdAt) : null;

  return {
    id: rawComment._id,
    text: rawComment.text,
    username: rawComment.author?.username || "Unknown",
    authorId: rawComment.author?._id || rawComment.author?.id || rawComment.author,
    avatar:
      rawComment.author?.profilePicture ||
      rawComment.author?.avatar ||
      DEFAULT_AVATAR,
    date: createdAt ? createdAt.toLocaleDateString() : "",
    likes: Array.isArray(rawComment.likes) ? rawComment.likes : [],
    likesCount: Array.isArray(rawComment.likes) ? rawComment.likes.length : 0,
    raw: rawComment,
  };
};

export const mapCommentsFromApi = (rawComments) => {
  if (!Array.isArray(rawComments)) return [];
  return rawComments.map(mapCommentFromApi);
};

