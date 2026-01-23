/**
 * Fonksiyonlar:
 * - login: Kullanıcı girişi yapar
 * - register: Yeni kullanıcı kaydı oluşturur
 * 
 * Kullanım:
 * - Login ve register sayfalarında kullanılır
 * - Hook'lar (useAuth) içinde kullanılır
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

