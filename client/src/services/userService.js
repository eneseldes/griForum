/**
 * User Service
 * 
 * User profil işlemleri için service.
 */

import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

const withAuth = true;

export const userService = {
  async getMe() {
    return api.get(endpoints.users.me, { withAuth });
  },

  async updateProfile(payload) {
    return api.put(endpoints.users.update, payload, { withAuth });
  },
};

export default userService;

