/**
 * useUpdatePost Hook
 * 
 * Mevcut post'u güncelleme işlemini yöneten custom hook. Form validation,
 * Editor.js content extraction ve API çağrısı yapar. Başarılı olursa
 * güncellenmiş post detay sayfasına yönlendirir.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostService } from "./PostService";
import { mapPostFromApi } from "./postMapper";
import { handleApiError } from "../../utils/errorHandler";
import { validatePost, extractEditorContent } from "./postUtils";

export function useUpdatePost(postId) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePost = async (title, category, editorRef) => {
    if (!validatePost(title, category, editorRef)) {
      return null;
    }

    setIsSubmitting(true);

    try {
      const content = await extractEditorContent(editorRef);
      if (!content) {
        setIsSubmitting(false);
        return null;
      }

      const rawResponse = await PostService.updatePost(postId, {
        title: title.trim(),
        content: content,
        category: category,
      });

      const mappedPost = mapPostFromApi(rawResponse.post || rawResponse);

      if (mappedPost && mappedPost.id) {
        navigate(`/post/${mappedPost.id}`);
        return mappedPost;
      } else {
        navigate(`/post/${postId}`);
        return null;
      }
    } catch (error) {
      handleApiError(error, navigate, "Failed to update post. Please try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updatePost, isSubmitting };
}

export default useUpdatePost;

