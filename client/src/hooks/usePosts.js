import { useEffect, useState } from "react";
import { PostService } from "../services/PostService";
import { mapPostsFromApi } from "../mappers/postMapper";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = await PostService.getPosts();
        if (!isMounted) return;
        setPosts(mapPostsFromApi(raw));
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { posts, loading, error };
}


