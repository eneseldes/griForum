/**
 * usePost Hook
 * 
 * Tek bir post'un detayını, yorumlarını ve etkileşimlerini yönetir.
 * Post detayı, comments, like state, owner kontrolü hepsi burada.
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { postService } from "../services/postService";
import { commentService } from "../services/commentService";
import { mapPostFromApi } from "../utils/mappers";
import { mapCommentsFromApi } from "../utils/mappers";
import { hasUserLiked as checkUserLiked, isUserOwner, getLikeCount } from "../utils/helpers";

export function usePost() {
  const { postId } = useParams();
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
        const [rawPost, rawComments] = await Promise.all([
          postService.getPostById(postId),
          commentService.getCommentsByPostId(postId).catch(() => []),
        ]);

        if (!isMounted) return;

        const mappedPost = mapPostFromApi(rawPost);
        setPost(mappedPost);
        setComments(mapCommentsFromApi(rawComments));

        // Calculate interactions
        if (mappedPost) {
          setHasUserLiked(checkUserLiked(mappedPost.likes));
          setLikeCount(getLikeCount(mappedPost.likes, mappedPost.likesCount));
          setIsPostOwner(isUserOwner(mappedPost.authorId));
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
  }, [postId]);

  // Update interactions when post changes
  useEffect(() => {
    if (post) {
      setHasUserLiked(checkUserLiked(post.likes));
      setLikeCount(getLikeCount(post.likes, post.likesCount));
      setIsPostOwner(isUserOwner(post.authorId));
    }
  }, [post]);

  const likePost = async () => {
    if (!postId) return;
    try {
      await postService.likePost(postId);
      setHasUserLiked(!hasUserLikedState);
      setLikeCount(prev => hasUserLikedState ? prev - 1 : prev + 1);
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

