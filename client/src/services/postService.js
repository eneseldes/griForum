/**
 * Post ile ilgili tüm API çağrılarını yöneten service.
 * CRUD operasyonları, beğeni, kaydetme ve filtreleme işlemlerini içerir.
 * 
 * Tüm metodlar backend'den gelen raw data'yı frontend formatına map eder.
 * Hook'lar zaten mapped data alır, ekstra mapping yapmaya gerek yoktur.
 * 
 * Fonksiyonlar:
 * - getPosts: Tüm postları getirir (kategori filtresi ile) - mapped
 * - getPostById: Tek post detayını getirir - mapped
 * - createPost: Yeni post oluşturur (auth gerekli) - mapped
 * - updatePost: Post günceller (auth gerekli) - mapped
 * - deletePost: Post siler (auth gerekli)
 * - likePost: Post'u beğenir/beğenmeyi kaldırır (auth gerekli)
 * - getMyPosts: Kullanıcının postlarını getirir (auth gerekli) - mapped
 * - getMyLikedPosts: Kullanıcının beğendiği postları getirir (auth gerekli) - mapped
 * 
 * Kullanım:
 * - Hook'lar (usePosts, usePost) içinde kullanılır
 * - Component'lerde direkt kullanılmaz, hook'lar üzerinden erişilir
 */

import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { mapPostFromApi, mapPostsFromApi } from "../utils/mappers";

// Authentication gerektiren istekler için flag
const withAuth = true;

export const postService = {
  async getPosts(category = null) {
    const params = category ? { category } : {};
    const rawResponse = await api.get(endpoints.posts.list, { params });
    return mapPostsFromApi(rawResponse);
  },

  async getPostById(postId) {
    const rawResponse = await api.get(endpoints.posts.detail(postId));
    return mapPostFromApi(rawResponse);
  },

  async createPost(payload) {
    const rawResponse = await api.post(endpoints.posts.create, payload, { withAuth });
    // Response içindeki post'u map et
    return mapPostFromApi(rawResponse.post || rawResponse);
  },

  async updatePost(postId, payload) {
    const rawResponse = await api.put(endpoints.posts.update(postId), payload, { withAuth });
    // Response içindeki post'u map et
    return mapPostFromApi(rawResponse.post || rawResponse);
  },

  async deletePost(postId) {
    return api.delete(endpoints.posts.delete(postId), { withAuth });
  },

  async likePost(postId) {
    return api.post(endpoints.posts.like(postId), null, { withAuth });
  },

  async getMyPosts() {
    const rawResponse = await api.get(endpoints.posts.myPosts, { withAuth });
    return mapPostsFromApi(rawResponse);
  },

  async getMyLikedPosts() {
    const rawResponse = await api.get(endpoints.posts.myLikedPosts, { withAuth });
    return mapPostsFromApi(rawResponse);
  },
};

export default postService;

