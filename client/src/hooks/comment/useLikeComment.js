/**
 * Tek bir yorum için like/unlike akışını yönetir.
 * LikeButton içinde kullanılmak üzere backend response'una göre
 * liked ve likeCount hesaplanır.
 */

import { useCallback } from "react";
import { commentService } from "../../services/commentService";

export function useLikeComment() {
  const likeComment = useCallback(async (commentId) => {
    if (!commentId) return null;
    const response = await commentService.likeComment(commentId);
    // Backend response: comment object with likes array
    if (response && Array.isArray(response.likes)) {
      const likeCount = response.likes.length;
      return {
        // liked bilgisi LikeButton içinde userId üzerinden hesaplanacak
        liked: undefined,
        likeCount,
      };
    }
    return null;
  }, []);

  return { likeComment };
}

export default useLikeComment;


