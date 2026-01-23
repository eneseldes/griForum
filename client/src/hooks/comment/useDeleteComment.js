/**
 * - API çağrısı
 * - Toast mesajı
 * - Error handling
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { commentService } from "../../services/commentService";
import { handleApiError } from "../../utils/errorHandler";
import { showSuccess } from "../../utils/toast";

export function useDeleteComment() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteComment = useCallback(
    async (commentId) => {
      if (!commentId) return false;

      setIsDeleting(true);
      try {
        await commentService.deleteComment(commentId);
        showSuccess("Yorum başarıyla silindi!");
        return true;
      } catch (error) {
        handleApiError(
          error,
          navigate,
          "Failed to delete comment. Please try again."
        );
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [navigate]
  );

  return { deleteComment, isDeleting };
}

export default useDeleteComment;


