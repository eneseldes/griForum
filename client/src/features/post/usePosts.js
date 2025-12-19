/**
 * usePosts Hook
 * 
 * Tüm post'ları fetch eden custom hook. Loading state ve error handling içerir.
 */

import { useEffect, useState } from "react";
import { PostService } from "./PostService";
import { mapPostsFromApi } from "./postMapper";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const raw = await PostService.getPosts();
        if (!isMounted) return;
        setPosts(mapPostsFromApi(raw));
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { posts, isLoading, error };
}

