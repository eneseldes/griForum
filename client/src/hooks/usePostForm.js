/**
 * usePostForm Hook
 * 
 * Post oluşturma ve güncelleme işlemlerini yönetir.
 * Create ve update işlemleri tek hook'ta birleştirilmiştir.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../services/postService";
import { mapPostFromApi } from "../utils/mappers";
import { handleApiError } from "../utils/errorHandler";
import { validatePost, extractEditorContent } from "../utils/helpers";
import { showError, showSuccess } from "../utils/toast";

export function usePostForm(postId = null) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = async (title, category, editorRef) => {
    if (!validatePost(title, category, editorRef, showError)) {
      return null;
    }

    setIsSubmitting(true);

    try {
      const content = await extractEditorContent(editorRef, showError);
      if (!content) {
        setIsSubmitting(false);
        return null;
      }

      const payload = {
        title: title.trim(),
        content: content,
        category: category,
      };

      const rawResponse = postId
        ? await postService.updatePost(postId, payload)
        : await postService.createPost(payload);

      const mappedPost = mapPostFromApi(rawResponse.post || rawResponse);

      if (mappedPost && mappedPost.id) {
        showSuccess(postId ? "Gönderi başarıyla güncellendi!" : "Gönderi başarıyla oluşturuldu!");
        navigate(`/post/${mappedPost.id}`);
        return mappedPost;
      } else {
        navigate(postId ? `/post/${postId}` : "/");
        return null;
      }
    } catch (error) {
      handleApiError(error, navigate, `Failed to ${postId ? 'update' : 'create'} post. Please try again.`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPost, isSubmitting };
}

export default usePostForm;

