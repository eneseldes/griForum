import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostService } from "../services/PostService";
import { CommentService } from "../services/CommentService";
import { mapPostFromApi } from "../mappers/postMapper";
import { mapCommentsFromApi } from "../mappers/commentMapper";

export function usePostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;
    let isMounted = true;

    const fetchPostAndComments = async () => {
      setLoading(true);
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
        if (isMounted) setLoading(false);
      }
    };

    fetchPostAndComments();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  return { post, comments, setComments, loading, error, postId };
}


