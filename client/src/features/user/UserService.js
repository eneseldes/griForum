/**
 * User Service
 * 
 * User ile ilgili tüm API çağrılarını yöneten service. Profil bilgileri,
 * profil güncelleme, kullanıcının post'ları ve beğendiği post'ları getirme işlemleri içerir.
 */

import { api } from "../shared/api";

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

