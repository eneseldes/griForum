/**
 * Tek bir post'un detayını, yorumlarını ve etkileşimlerini yönetir.
 * Post detay sayfası için kullanılır.
 *
 * Yönettiği Veriler:
 * - Post detayı (başlık, içerik, yazar, kategori vb.)
 * - Post yorumları (array)
 * - Beğeni durumu (kullanıcı beğenmiş mi?)
 * - Beğeni sayısı
 * - Sahiplik kontrolü (kullanıcı post sahibi mi?)
 *
 * Döndürdüğü Değerler:
 * - post: Post objesi
 * - comments: Yorum array'i
 * - setComments: Yorum array'ini güncelleme fonksiyonu
 * - isLoading: Yükleniyor mu? (boolean)
 * - error: Hata objesi (varsa)
 * - postId: Post ID'si (URL'den alınır)
 * - hasUserLiked: Kullanıcı beğenmiş mi? (boolean)
 * - likeCount: Beğeni sayısı (number)
 * - isOwner: Kullanıcı post sahibi mi? (boolean)
 * - likePost: Post beğenme fonksiyonu
 * - setHasUserLiked: Beğeni durumunu güncelleme fonksiyonu
 * - setLikeCount: Beğeni sayısını güncelleme fonksiyonu
 *
 * Kullanım:
 * - PostDetailPage component'inde kullanılır
 * - Örnek: const { post, comments, isLoading } = usePost();
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { postService } from "../../services/postService";
import { commentService } from "../../services/commentService";
import {
  hasUserLiked as checkUserLiked,
  isUserOwner,
  getLikeCount,
} from "../../utils/helpers";
import { useAuth } from "../../contexts/useAuth";

export function usePost() {
  const { postId } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Interaction states
  const [hasUserLikedState, setHasUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isPostOwner, setIsPostOwner] = useState(false);

  useEffect(() => {
    if (!postId) return;
    let isMounted = true;

    const fetchPostAndComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [mappedPost, mappedComments] = await Promise.all([
          postService.getPostById(postId),
          commentService.getCommentsByPostId(postId).catch(() => []),
        ]);

        if (!isMounted) return;

        // Service'ler zaten mapped data döndürüyor
        setPost(mappedPost);
        setComments(mappedComments);

        // Calculate interactions
        if (mappedPost) {
          const userId = user?._id;
          setHasUserLiked(checkUserLiked(mappedPost.likes, userId));
          setLikeCount(
            getLikeCount(mappedPost.likes, mappedPost.likesCount)
          );
          setIsPostOwner(isUserOwner(mappedPost.authorId, userId));
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPostAndComments();

    return () => {
      isMounted = false;
    };
  }, [postId, user]);

  // Update interactions when post or user changes
  useEffect(() => {
    if (post) {
      const userId = user?._id;
      setHasUserLiked(checkUserLiked(post.likes, userId));
      setLikeCount(getLikeCount(post.likes, post.likesCount));
      setIsPostOwner(isUserOwner(post.authorId, userId));
    }
  }, [post, user]);

  const likePost = async () => {
    if (!postId) return;
    try {
      await postService.likePost(postId);
      setHasUserLiked(!hasUserLikedState);
      setLikeCount((prev) => (hasUserLikedState ? prev - 1 : prev + 1));
    } catch (error) {
      // Error will be handled by component
      throw error;
    }
  };

  return {
    post,
    comments,
    setComments,
    isLoading,
    error,
    postId,
    hasUserLiked: hasUserLikedState,
    likeCount,
    isOwner: isPostOwner,
    likePost,
    setHasUserLiked,
    setLikeCount,
  };
}

export default usePost;


