/**
 * Comment Service
 * 
 * Comment ile ilgili tüm API çağrılarını yöneten service.
 */

import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

const withAuth = true;

export const commentService = {
  async getCommentsByPostId(postId) {
    return api.get(endpoints.comments.list(postId));
  },

  async createComment(postId, payload) {
    return api.post(endpoints.comments.create(postId), payload, { withAuth });
  },

  async updateComment(commentId, payload) {
    return api.put(endpoints.comments.update(commentId), payload, { withAuth });
  },

  async deleteComment(commentId) {
    return api.delete(endpoints.comments.delete(commentId), { withAuth });
  },

  async likeComment(commentId) {
    return api.post(endpoints.comments.like(commentId), null, { withAuth });
  },
};

export default commentService;

