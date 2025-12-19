/**
 * Post Mapper
 * 
 * Backend'den gelen raw post verilerini frontend formatına dönüştüren mapper.
 * Editor.js content'ini plain text'e çevirir, excerpt oluşturur ve
 * görsel URL'lerini düzenler.
 */

import { editorJsToPlainText } from "../../utils/editorUtils";
import { DEFAULT_IMAGE } from "../../constants/config";

const getImageUrl = (images) => {
  if (!Array.isArray(images) || images.length === 0) return DEFAULT_IMAGE;
  const first = images[0];
  // Eğer backend zaten tam URL dönüyorsa direkt kullan
  if (first.startsWith("http://") || first.startsWith("https://")) {
    return first;
  }
  // Public klasöründen çek (relative path)
  if (first.startsWith("/")) {
    return first;
  }
  // Relative path olarak döndür
  return `/${first}`;
};

export const mapPostFromApi = (rawPost) => {
  if (!rawPost) return null;

  const createdAt = rawPost.createdAt ? new Date(rawPost.createdAt) : null;

  // Editor.js content'ini plain text'e çevir ve excerpt oluştur
  const plainText = editorJsToPlainText(rawPost.content);
  const excerpt = editorJsToPlainText(rawPost.content, 150);

  return {
    id: rawPost._id,
    title: rawPost.title,
    content: rawPost.content,
    category: rawPost.category,
    image: getImageUrl(rawPost.images),
    // UI için kısa özet (ilk 150 kelime)
    excerpt: excerpt || "No content available",
    date: createdAt ? createdAt.toLocaleDateString() : "",
    // Post detail route'u ile eşleşecek şekilde
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

