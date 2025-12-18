import { api } from "./api";

const withAuth = true;

export const PostService = {
  async getPosts() {
    // Public endpoint in backend: GET /api/posts
    return api.get("/posts");
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


