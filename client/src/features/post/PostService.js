/**
 * Post Service
 * 
 * Post ile ilgili tüm API çağrılarını yöneten service. CRUD işlemleri,
 * beğeni işlemleri ve kategori filtreleme içerir.
 */

import { api } from "../shared/api";

const withAuth = true;

export const PostService = {
  async getPosts(category = null) {
    // Public endpoint in backend: GET /api/posts?category=...
    const queryParams = category ? `?category=${encodeURIComponent(category)}` : "";
    return api.get(`/posts${queryParams}`);
  },

  async getPostById(postId) {
    // GET /api/posts/:id
    return api.get(`/posts/${postId}`);
  },

  async createPost(payload) {
    // POST /api/posts (auth)
    return api.post("/posts", payload, { withAuth });
  },

  async updatePost(postId, payload) {
    // PUT /api/posts/:id (auth)
    return api.put(`/posts/${postId}`, payload, { withAuth });
  },

  async deletePost(postId) {
    // DELETE /api/posts/:id (auth)
    return api.delete(`/posts/${postId}`, { withAuth });
  },

  async likePost(postId) {
    // POST /api/posts/:postId/like (auth)
    return api.post(`/posts/${postId}/like`, null, { withAuth });
  },
};

export default PostService;

