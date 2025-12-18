import { useCallback, useState } from "react";
import { CommentService } from "../services/CommentService";
import { mapCommentFromApi } from "../mappers/commentMapper";

export function useCreateComment(postId) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(
    async (text) => {
      setError(null);
      const clean = (text || "").trim();
      if (!postId) throw new Error("Missing postId");
      if (!clean) return null;

      try {
        setSubmitting(true);
        const created = await CommentService.createComment(postId, { text: clean });
        return mapCommentFromApi(created);
      } catch (err) {
        const msg = err?.message || "Failed to create comment";
        setError(msg);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [postId]
  );

  const resetError = useCallback(() => setError(null), []);

  return { create, submitting, error, resetError };
}

export default useCreateComment;
