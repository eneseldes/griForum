/**
 * Tek bir post için like/unlike akışını yönetir.
 * LikeButton içinde kullanılmak üzere optimistic update ve
 * backend response senkronizasyonunu kapsar.
 */

import { useCallback } from "react";
import { postService } from "../../services/postService";

export function useLikePost() {
  const likePost = useCallback(async (postId) => {
    if (!postId) return null;
    const response = await postService.likePost(postId);
    // Beklenen response: { liked: boolean, likeCount: number }
    if (
      response &&
      typeof response.liked === "boolean" &&
      typeof response.likeCount === "number"
    ) {
      return {
        liked: response.liked,
        likeCount: response.likeCount,
      };
    }
    return null;
  }, []);

  return { likePost };
}

export default useLikePost;


