/**
 * Backend'den gelen ham (raw) verilerini frontend formatına dönüştüren mapper fonksiyonları.
 * Tüm entity'ler için (Post, Comment, User) mapping işlemleri burada toplanmıştır.
 * 
 * Neden Gerekli:
 * - Backend MongoDB'den gelen veriler frontend formatından farklı olabilir
 * - _id -> id dönüşümü
 * - Tarih formatlaması (Date -> string)
 * - Editor.js JSON'dan plain text çıkarma
 * - Görsel URL'lerini düzenleme
 * - Like/comment sayılarını hesaplama
 * 
 * Fonksiyonlar:
 * - mapPostFromApi: Tek post'u frontend formatına dönüştürür
 * - mapPostsFromApi: Post array'ini frontend formatına dönüştürür
 * - mapCommentFromApi: Tek yorumu frontend formatına dönüştürür
 * - mapCommentsFromApi: Yorum array'ini frontend formatına dönüştürür
 * - getImageUrl: Görsel URL'ini düzenler (internal helper)
 */

import { editorJsToPlainText } from "./editorUtils";
import { DEFAULT_IMAGE, DEFAULT_AVATAR } from "../constants/config";

// ==================== POST MAPPERS ====================

const getImageUrl = (images) => {
  if (!Array.isArray(images) || images.length === 0) return DEFAULT_IMAGE;
  const first = images[0];
  if (first.startsWith("http://") || first.startsWith("https://")) {
    return first;
  }
  if (first.startsWith("/")) {
    return first;
  }
  return `/${first}`;
};


export const mapPostFromApi = (rawPost) => {
  if (!rawPost) return null;

  const createdAt = rawPost.createdAt ? new Date(rawPost.createdAt) : null;
  const plainText = editorJsToPlainText(rawPost.content);
  const excerpt = editorJsToPlainText(rawPost.content, 150);

  return {
    id: rawPost._id,
    title: rawPost.title,
    content: rawPost.content,
    category: rawPost.category,
    image: getImageUrl(rawPost.images),
    excerpt: excerpt || "No content available",
    date: createdAt ? createdAt.toLocaleDateString() : "",
    link: `/post/${rawPost._id}`,
    authorName: rawPost.author?.username || "Unknown",
    authorId: rawPost.author?._id || rawPost.author?.id || rawPost.author,
    likesCount: Array.isArray(rawPost.likes) ? rawPost.likes.length : 0,
    likes: Array.isArray(rawPost.likes) ? rawPost.likes : [],
    commentsCount: Array.isArray(rawPost.comments) ? rawPost.comments.length : 0,
    raw: rawPost,
  };
};

export const mapPostsFromApi = (rawPosts) => {
  if (!Array.isArray(rawPosts)) return [];
  return rawPosts.map(mapPostFromApi);
};

// ==================== COMMENT MAPPERS ====================

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