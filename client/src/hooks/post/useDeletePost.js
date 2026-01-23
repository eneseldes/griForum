/**
 * Tek bir post'un silinmesi için delete akışını yönetir.
 * - API çağrısı
 * - Toast mesajı
 * - Navigate
 * - Error handling
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import { handleApiError } from "../../utils/errorHandler";
import { showSuccess } from "../../utils/toast";

export function useDeletePost() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = useCallback(
    async (postId) => {
      if (!postId) return false;

      setIsDeleting(true);
      try {
        await postService.deletePost(postId);
        showSuccess("Gönderi başarıyla silindi!");
        navigate("/");
        return true;
      } catch (error) {
        handleApiError(
          error,
          navigate,
          "Failed to delete post. Please try again."
        );
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [navigate]
  );

  return { deletePost, isDeleting };
}

export default useDeletePost;


