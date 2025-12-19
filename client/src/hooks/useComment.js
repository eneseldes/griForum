/**
 * useComment Hook
 * 
 * Comment oluşturma ve etkileşimlerini yönetir.
 */

import { useCallback, useState } from "react";
import { commentService } from "../services/commentService";
import { mapCommentFromApi } from "../utils/mappers";
import { hasUserLiked, isUserOwner, getLikeCount } from "../utils/helpers";
import { showSuccess } from "../utils/toast";

export function useComment(postId) {
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
        const created = await commentService.createComment(postId, { text: clean });
        const mapped = mapCommentFromApi(created);
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

  const likeComment = useCallback(async (commentId) => {
    try {
      await commentService.likeComment(commentId);
    } catch (err) {
      throw err;
    }
  }, []);

  const getCommentInteractions = useCallback((comment) => {
    if (!comment) return { hasLiked: false, likeCount: 0, isOwner: false };
    
    return {
      hasLiked: hasUserLiked(comment.likes),
      likeCount: getLikeCount(comment.likes, comment.likesCount),
      isOwner: isUserOwner(comment.authorId),
    };
  }, []);

  const resetError = useCallback(() => setError(null), []);

  return { 
    create, 
    likeComment,
    getCommentInteractions,
    isSubmitting, 
    error, 
    resetError 
  };
}

export default useComment;

