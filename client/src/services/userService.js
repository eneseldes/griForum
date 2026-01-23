/**
 * Kullanıcı profil işlemleri için service.
 * Profil bilgilerini getirme ve güncelleme işlemlerini içerir.
 * 
 * Fonksiyonlar:
 * - getMe: Kullanıcı bilgilerini getirir (auth gerekli)
 * - updateProfile: Kullanıcı profilini günceller (auth gerekli)
 * 
 * Kullanım:
 * - useProfile hook'unda kullanılır
 * - Profil sayfasında kullanılır
 */

import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

// Authentication gerektiren istekler için flag
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

