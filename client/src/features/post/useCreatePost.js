/**
 * useCreatePost Hook
 * 
 * Yeni post oluşturma işlemini yöneten custom hook. Form validation,
 * Editor.js content extraction ve API çağrısı yapar. Başarılı olursa
 * post detay sayfasına yönlendirir.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostService } from "./PostService";
import { mapPostFromApi } from "./postMapper";
import { handleApiError } from "../../utils/errorHandler";
import { validatePost, extractEditorContent } from "./postUtils";

export function useCreatePost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPost = async (title, category, editorRef) => {
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

      const rawResponse = await PostService.createPost({
        title: title.trim(),
        content: content,
        category: category,
      });

      const mappedPost = mapPostFromApi(rawResponse.post || rawResponse);

      if (mappedPost && mappedPost.id) {
        navigate(`/post/${mappedPost.id}`);
        return mappedPost;
      } else {
        navigate("/");
        return null;
      }
    } catch (error) {
      handleApiError(error, navigate, "Failed to create post. Please try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createPost, isSubmitting };
}

export default useCreatePost;

