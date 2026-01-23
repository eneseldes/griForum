/**
 * Post oluşturma ve güncelleme işlemlerini yönetir.
 * Create ve update işlemleri tek hook'ta birleştirilmiştir.
 *
 * Özellikler:
 * - Form validasyonu (başlık, kategori, içerik kontrolü)
 * - Editor.js içeriğini çıkarma
 * - API çağrısı yapma
 * - Başarılı işlem sonrası yönlendirme
 * - Hata yönetimi
 *
 * Döndürdüğü Değerler:
 * - submitPost: Post gönderme fonksiyonu
 * - isSubmitting: Gönderiliyor mu? (boolean)
 *
 * Parametreler:
 * - postId: Post ID'si (varsa update, yoksa create)
 *
 * Kullanım:
 * - CreatePostPage ve EditPostPage component'lerinde kullanılır
 * - Örnek: const { submitPost, isSubmitting } = usePostForm(postId);
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import { handleApiError } from "../../utils/errorHandler";
import { validatePost, extractEditorContent } from "../../utils/helpers";
import { showError, showSuccess } from "../../utils/toast";

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

      // Service'ler zaten mapped data döndürüyor
      const mappedPost = postId
        ? await postService.updatePost(postId, payload)
        : await postService.createPost(payload);

      if (mappedPost && mappedPost.id) {
        showSuccess(
          postId
            ? "Gönderi başarıyla güncellendi!"
            : "Gönderi başarıyla oluşturuldu!"
        );
        navigate(`/post/${mappedPost.id}`);
        return mappedPost;
      } else {
        navigate(postId ? `/post/${postId}` : "/");
        return null;
      }
    } catch (error) {
      handleApiError(
        error,
        navigate,
        `Failed to ${postId ? "update" : "create"} post. Please try again.`
      );
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPost, isSubmitting };
}

export default usePostForm;


