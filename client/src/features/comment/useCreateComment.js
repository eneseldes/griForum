/**
 * useCreateComment Hook
 * 
 * Yeni comment oluşturma işlemini yöneten custom hook. Form validation,
 * API çağrısı ve error handling içerir.
 */

import { useCallback, useState } from "react";
import { CommentService } from "./CommentService";
import { mapCommentFromApi } from "./commentMapper";

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
        const created = await CommentService.createComment(postId, { text: clean });
        return mapCommentFromApi(created);
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

  return { create, isSubmitting, error, resetError };
}

export default useCreateComment;

