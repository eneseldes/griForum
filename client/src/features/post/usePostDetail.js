/**
 * usePostDetail Hook
 * 
 * Tek bir post'un detayını ve yorumlarını fetch eden custom hook.
 * URL'den postId alır ve post ile comment'leri paralel olarak yükler.
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostService } from "./PostService";
import { CommentService } from "../comment/CommentService";
import { mapPostFromApi } from "./postMapper";
import { mapCommentsFromApi } from "../comment/commentMapper";

export function usePostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;
    let isMounted = true;

    const fetchPostAndComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [rawPost, rawComments] = await Promise.all([
          PostService.getPostById(postId),
          CommentService.getCommentsByPostId(postId).catch(() => []),
        ]);

        if (!isMounted) return;

        setPost(mapPostFromApi(rawPost));
        setComments(mapCommentsFromApi(rawComments));
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

  return { post, comments, setComments, isLoading, error, postId };
}

