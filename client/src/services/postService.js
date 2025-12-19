/**
 * Post Service
 * 
 * Post ile ilgili tüm API çağrılarını yöneten service.
 */

import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

const withAuth = true;

export const postService = {
  async getPosts(category = null) {
    const queryParams = category ? `?category=${encodeURIComponent(category)}` : "";
    return api.get(`${endpoints.posts.list}${queryParams}`);
  },

  async getPostById(postId) {
    return api.get(endpoints.posts.detail(postId));
  },

  async createPost(payload) {
    return api.post(endpoints.posts.create, payload, { withAuth });
  },

  async updatePost(postId, payload) {
    return api.put(endpoints.posts.update(postId), payload, { withAuth });
  },

  async deletePost(postId) {
    return api.delete(endpoints.posts.delete(postId), { withAuth });
  },

  async likePost(postId) {
    return api.post(endpoints.posts.like(postId), null, { withAuth });
  },

  async getMyPosts() {
    return api.get(endpoints.posts.myPosts, { withAuth });
  },

  async getMyLikedPosts() {
    return api.get(endpoints.posts.myLikedPosts, { withAuth });
  },
};

export default postService;

