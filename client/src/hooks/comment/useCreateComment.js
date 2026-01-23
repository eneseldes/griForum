/**
 * Döndürdüğü Değerler:
 * - create: Yorum oluşturma fonksiyonu
 * - isSubmitting: Gönderiliyor mu? (boolean)
 * - error: Hata mesajı (string)
 * - resetError: Hata mesajını sıfırlama fonksiyonu
 *
 * Parametreler:
 * - postId: Yorum yapılacak post ID'si
 *
 * Kullanım:
 * - CommentForm component'inde kullanılır
 * - Örnek: const { create, isSubmitting } = useCreateComment(postId);
 */

import { useCallback, useState } from "react";
import { commentService } from "../../services/commentService";
import { showSuccess } from "../../utils/toast";

export function useCreateComment(postId) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(
    async (text) => {
      setError(null);
      const clean = (text || "").trim();
      if (!postId) throw new Error("Missing postId");
      if (!clean) return null;

      try {
        setIsSubmitting(true);
        // Service zaten mapped data döndürüyor
        const mapped = await commentService.createComment(postId, {
          text: clean,
        });
        showSuccess("Yorum başarıyla eklendi!");
        return mapped;
      } catch (err) {
        const msg = err?.message || "Failed to create comment";
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [postId]
  );

  const resetError = useCallback(() => setError(null), []);

  return {
    create,
    isSubmitting,
    error,
    resetError,
  };
}

export default useCreateComment;


