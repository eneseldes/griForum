/**
 * Auth Service
 * 
 * Authentication ile ilgili API çağrılarını yöneten service.
 */

import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

export const authService = {
  async login(email, password) {
    return api.post(endpoints.auth.login, { email, password });
  },

  async register(email, username, password) {
    return api.post(endpoints.auth.register, { email, username, password });
  },
};

export default authService;

