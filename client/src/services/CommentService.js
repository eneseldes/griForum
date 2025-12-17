import { api } from "./api";

const withAuth = true;

export const CommentService = {
  async getCommentsByPostId(postId) {
    // Backend route: GET /api/comments/:postId/comments
    return api.get(`/comments/${postId}/comments`);
  },

  async createComment(postId, payload) {
    // In TestBackend we were using: POST /api/comments/:postId/comments
    return api.post(`/comments/${postId}/comments`, payload, { withAuth });
  },

  async updateComment(commentId, payload) {
    // PUT /api/comments/:id
    return api.put(`/comments/${commentId}`, payload, { withAuth });
  },

  async deleteComment(commentId) {
    // DELETE /api/comments/:id
    return api.delete(`/comments/${commentId}`, { withAuth });
  },
};

export default CommentService;


