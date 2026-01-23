/**
 * Yorum ile ilgili tüm API çağrılarını yöneten service.
 * CRUD operasyonları ve beğeni işlemlerini içerir.
 * 
 * Tüm metodlar backend'den gelen raw data'yı frontend formatına map eder.
 * Hook'lar zaten mapped data alır, ekstra mapping yapmaya gerek yoktur.
 * 
 * Fonksiyonlar:
 * - getCommentsByPostId: Bir post'un yorumlarını getirir - mapped
 * - createComment: Yeni yorum oluşturur (auth gerekli) - mapped
 * - updateComment: Yorum günceller (auth gerekli) - mapped
 * - deleteComment: Yorum siler (auth gerekli)
 * - likeComment: Yorumu beğenir/beğenmeyi kaldırır (auth gerekli)
 * 
 * Kullanım:
 * - useComment hook'unda kullanılır
 * - usePost hook'unda yorumları getirmek için kullanılır
 */

import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { mapCommentFromApi, mapCommentsFromApi } from "../utils/mappers";

// Authentication gerektiren istekler için flag
const withAuth = true;

export const commentService = {
  async getCommentsByPostId(postId) {
    const rawResponse = await api.get(endpoints.comments.list(postId));
    return mapCommentsFromApi(rawResponse);
  },

  async createComment(postId, payload) {
    const rawResponse = await api.post(endpoints.comments.create(postId), payload, { withAuth });
    return mapCommentFromApi(rawResponse);
  },

  async updateComment(commentId, payload) {
    const rawResponse = await api.put(endpoints.comments.update(commentId), payload, { withAuth });
    return mapCommentFromApi(rawResponse);
  },

  async deleteComment(commentId) {
    return api.delete(endpoints.comments.delete(commentId), { withAuth });
  },

  async likeComment(commentId) {
    return api.post(endpoints.comments.like(commentId), null, { withAuth });
  },
};

export default commentService;

