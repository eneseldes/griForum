import { api } from "./api";

const withAuth = true;

export const UserService = {
  async getMe() {
    // GET /api/auth/me (auth)
    return api.get("/auth/me", { withAuth });
  },

  async updateProfile(payload) {
    // PUT /api/users/update (auth)
    return api.put("/users/update", payload, { withAuth });
  },

  async getMyPosts() {
    // GET /api/users/myposts (auth)
    return api.get("/users/myposts", { withAuth });
  },

  async getLikedPosts() {
    // GET /api/users/liked (auth)
    return api.get("/users/liked", { withAuth });
  },
};

export default UserService;

